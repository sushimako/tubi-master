"""Curriculum planner for the TU Wien Master Bauingenieurwissenschaften.

Choices live in the browser's localStorage. Signing up additionally stores
them in a SQLite database, restorable with a two-word passcode.
"""
import datetime
import hashlib
import hmac
import json
import os
import pathlib
import secrets
import sqlite3
import time
import unicodedata
from contextlib import closing

from flask import Flask, g, jsonify, render_template, request, session

ROOT = pathlib.Path(__file__).resolve().parent
INSTANCE = ROOT / "instance"
DATABASE = INSTANCE / "tubi.sqlite3"
CURRICULUM = json.loads((ROOT / "data" / "curriculum.json").read_text())
# EFF large wordlist (CC BY 3.0 US), restricted to plain lowercase words.
WORDS = (ROOT / "data" / "wordlist.txt").read_text().split()
NAME_MAX_LENGTH = 16
MAX_FAILED_LOGINS = 10
FAILED_LOGIN_WINDOW = 15 * 60  # seconds

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    passcode_hash TEXT NOT NULL UNIQUE,
    selection TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


def load_secret():
    """Return the instance secret, creating it on first start.

    It signs session cookies and keys the passcode hashes, so losing or
    replacing it invalidates every passcode.
    """
    INSTANCE.mkdir(exist_ok=True)
    path = INSTANCE / "secret.key"
    try:
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "w") as file:
            file.write(secrets.token_hex(32))
    except FileExistsError:
        pass
    return path.read_text().strip()


SECRET = load_secret()
with closing(sqlite3.connect(DATABASE)) as connection:
    connection.executescript(SCHEMA)

app = Flask(__name__)
app.secret_key = SECRET
app.config.update(
    MAX_CONTENT_LENGTH=256 * 1024,
    SESSION_COOKIE_SAMESITE="Lax",
    PERMANENT_SESSION_LIFETIME=datetime.timedelta(days=365),
)

# Client address -> timestamps of recent failed logins. Per process, which is
# enough to make guessing passcodes over HTTP impractical.
failed_logins = {}


def db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_exception):
    connection = g.pop("db", None)
    if connection is not None:
        connection.close()


def error(message, status):
    return jsonify(error=message), status


def json_body():
    # Requiring a JSON body also keeps other sites from posting forms to the API.
    body = request.get_json(silent=True)
    return body if isinstance(body, dict) else {}


def clean_name(raw):
    name = " ".join(str(raw).split())
    if not 0 < len(name) <= NAME_MAX_LENGTH or any(unicodedata.category(ch) == "Cc" for ch in name):
        return None
    return name


def selection_json(body):
    selection = body.get("selection")
    return json.dumps(selection, ensure_ascii=False) if isinstance(selection, dict) else None


def normalize_passcode(raw):
    """Accept "Apple Tree", "apple tree" or "apple-tree" for "apple-tree"."""
    return "-".join(str(raw).lower().replace("-", " ").split())


def passcode_hash(passcode):
    # Login looks users up by passcode alone, so the hash has to be deterministic.
    return hmac.new(SECRET.encode(), passcode.encode(), hashlib.sha256).hexdigest()


def current_user():
    user_id = session.get("user_id")
    if user_id is None:
        return None
    return db().execute("SELECT id, name, selection FROM users WHERE id = ?", (user_id,)).fetchone()


def account(user):
    return {"name": user["name"], "selection": json.loads(user["selection"])} if user else None


def sign_in(user_id):
    session.clear()
    session.permanent = True
    session["user_id"] = user_id


@app.get("/")
def index():
    return render_template("index.html", curriculum=CURRICULUM, account=account(current_user()))


@app.get("/api/curriculum")
def curriculum():
    return CURRICULUM


@app.post("/api/signup")
def signup():
    body = json_body()
    name = clean_name(body.get("name", ""))
    if name is None:
        return error(f"Der Name muss 1 bis {NAME_MAX_LENGTH} Zeichen lang sein.", 400)
    selection = selection_json(body)
    if selection is None:
        return error("Ungültige Auswahl.", 400)
    for _ in range(20):
        passcode = f"{secrets.choice(WORDS)}-{secrets.choice(WORDS)}"
        try:
            cursor = db().execute(
                "INSERT INTO users (name, passcode_hash, selection) VALUES (?, ?, ?)",
                (name, passcode_hash(passcode), selection),
            )
        except sqlite3.IntegrityError:
            continue  # passcode already taken
        db().commit()
        sign_in(cursor.lastrowid)
        return jsonify(passcode=passcode, account={"name": name, "selection": json.loads(selection)})
    return error("Es konnte kein Passcode erzeugt werden. Bitte versuche es noch einmal.", 503)


@app.post("/api/login")
def login():
    client = request.remote_addr
    now = time.monotonic()
    recent = [t for t in failed_logins.get(client, []) if now - t < FAILED_LOGIN_WINDOW]
    if len(recent) >= MAX_FAILED_LOGINS:
        return error("Zu viele Fehlversuche. Bitte versuche es später noch einmal.", 429)
    passcode = normalize_passcode(json_body().get("passcode", ""))
    user = db().execute(
        "SELECT id, name, selection FROM users WHERE passcode_hash = ?", (passcode_hash(passcode),)
    ).fetchone()
    if user is None:
        failed_logins[client] = recent + [now]
        return error("Unbekannter Passcode.", 401)
    failed_logins.pop(client, None)
    sign_in(user["id"])
    return jsonify(account=account(user))


@app.post("/api/logout")
def logout():
    session.clear()
    return "", 204


@app.put("/api/selection")
def save_selection():
    user = current_user()
    if user is None:
        return error("Nicht angemeldet.", 401)
    selection = selection_json(json_body())
    if selection is None:
        return error("Ungültige Auswahl.", 400)
    db().execute(
        "UPDATE users SET selection = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (selection, user["id"])
    )
    db().commit()
    return "", 204


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
