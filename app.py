"""Curriculum planner for the TU Wien Master Bauingenieurwissenschaften.

All user choices live in the browser's localStorage; the server only
delivers the page and the curriculum data scraped by scripts/scrape_tiss.py.
"""
import json
import pathlib

from flask import Flask, render_template

ROOT = pathlib.Path(__file__).resolve().parent
CURRICULUM = json.loads((ROOT / "data" / "curriculum.json").read_text())

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html", curriculum=CURRICULUM)


@app.get("/api/curriculum")
def curriculum():
    return CURRICULUM


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
