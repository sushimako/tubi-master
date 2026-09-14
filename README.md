# Curriculum Planner – Master Bauingenieurwissenschaften

Planner for the TU Wien Master Bauingenieurwissenschaften (UE 066 505, Studienplan 2025).
Flask serves one page; all choices are stored in the browser's localStorage.

## Run

```sh
uv run app.py   # dev server on http://localhost:8000
```

## Deploy

Deployment copies the code to a Linux host over SSH, installs the dependencies there with
uv and runs the app with gunicorn as a systemd service on port 8000. Locally you only need
`ssh` and `rsync`; the host needs `sudo` (uv is installed automatically if missing).

```sh
DEPLOY_HOST=myvm.exe.xyz ops/deploy.sh   # sync, install, (re)start and check the service
```

The code goes to `~/tubi-master` and the service is called `curriculum`, replacing the unit of
the former Next.js version. Override with `DEPLOY_DIR`, `DEPLOY_SERVICE` and `DEPLOY_PORT`.
Deploys never touch `instance/` on the host.

## Accounts

Signing up is optional. It stores the selection in `instance/tubi.sqlite3` and hands out a
two-word passcode from the [EFF large wordlist](https://www.eff.org/dice) (CC BY 3.0 US,
`data/wordlist.txt`). Only an HMAC of the passcode is stored, keyed with `instance/secret.key`,
which is created on first start and also signs the session cookie. Back it up together with
the database: if it is lost or replaced, every passcode stops working.

## Update the curriculum data

```sh
uv run scripts/scrape_tiss.py          # fetch from TISS, writes data/curriculum.json
uv run scripts/scrape_tiss.py --cache  # re-parse pages cached in scripts/.cache
```

The scraper reads the curriculum and both Transferable Skills catalogs for the
previous and the current academic year. Module structure comes from the current
year; the previous year only adds past offerings (e.g. summer courses not yet
announced). Restart the app after scraping.

TISS is the authority for modules, courses, types and ECTS. Where it differs from the
Studienplan PDF (e.g. Numerical Geotechnics missing from M2 GT on TISS), the TISS
data is kept as is.

## Layout

- `app.py` – Flask app (`/` and `/api/curriculum`)
- `templates/index.html`, `static/app.js`, `static/style.css` – the planner UI, including the ECTS rules
- `data/curriculum.json` – generated curriculum data
- `scripts/scrape_tiss.py` – TISS scraper
- `ops/` – deployment script and systemd unit template
- `instance/` – SQLite database and secret key (created on first start, not in git)
