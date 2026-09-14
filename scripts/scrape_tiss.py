#!/usr/bin/env python3
"""Scrape the TISS curriculum of the Master Bauingenieurwissenschaften (066 505)
and the Transferable Skills catalogs into data/curriculum.json.

Usage:
    uv run scripts/scrape_tiss.py            # fetch fresh pages from TISS
    uv run scripts/scrape_tiss.py --cache    # reuse pages in scripts/.cache

TISS renders the curriculum as a flat table whose rows carry a
`nodeTable-level-N` class. Rows without a course key are structure nodes
(Prüfungsfach, Modul, catalog groups, LVA entries such as "VU Baustatik 2");
rows with a course key ("202.068 VU 2026W") are concrete offerings of the
LVA entry directly above them. We rebuild that tree and interpret it.

The structure (which LVAs belong to which module) is taken from the newest
academic year. Older years only contribute offerings, so that summer courses
not yet announced for the current year still show when they were last held.
"""
import argparse
import datetime
import json
import pathlib
import re
import warnings

import requests
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning

warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "curriculum.json"
CACHE = ROOT / "scripts" / ".cache"

TISS = "https://tiss.tuwien.ac.at"
CURRICULUM_KEY = "65319"
TS_CATALOGS = [
    ("63744", "Bau- und Umweltingenieurwesen"),
    ("57214", "TU-weiter Katalog"),
]
PDF_URL = (
    "https://www.tuwien.at/fileadmin/Assets/dienstleister/studienabteilung/"
    "MSc-Studienplaene_2025/Masterstudium_Bauingenieurwissenschaften_2025.pdf"
)

ITEM_RE = re.compile(r"^([A-Z]{2})\s+(.+)$")
MODULE_RE = re.compile(r"^Modul (Masterspezifische|Vertiefende) Ausbildung (.+) \((M[12]) (\w+)\)$")
# Not allowed as Freie Wahlfächer according to the catalog note on TISS.
FW_EXCLUDED_GROUPS = {"Facheinschlägige Praxis"}
FW_EXCLUDED_TITLE_RE = re.compile(r"Aufbaukurs|Auffrischung", re.I)


def fetch(key, year, use_cache):
    path = CACHE / f"{key}_{year}.html"
    if use_cache and path.exists():
        return path.read_text()
    # TISS' DeltaSpike window handler normally sets this cookie via JavaScript
    # before redirecting; setting it ourselves skips the "Loading..." page.
    session = requests.Session()
    window_id, request_token = "1000", "1"
    session.cookies.set(f"dsrwid-{request_token}", window_id, domain="tiss.tuwien.ac.at", path="/")
    response = session.get(
        f"{TISS}/curriculum/public/curriculum.xhtml",
        params={
            "key": key,
            "semester": "YEAR",
            "semesterCode": f"{year}W",
            "viewAcademicYear": "true",
            "locale": "de",
            "dsrid": request_token,
            "dswid": window_id,
        },
        headers={"User-Agent": "tubi-master curriculum planner", "Accept-Language": "de"},
        timeout=60,
    )
    response.raise_for_status()
    if "nodeTable-level-" not in response.text:
        raise RuntimeError(f"TISS returned no curriculum table for key={key} year={year}")
    CACHE.mkdir(parents=True, exist_ok=True)
    path.write_text(response.text)
    return response.text


def number(cell):
    text = cell.get_text(strip=True).replace(",", ".")
    return float(text) if text else None


def parse_tree(html):
    soup = BeautifulSoup(html, "lxml")
    for script in soup.find_all("script"):
        script.decompose()
    root = {"level": -1, "children": []}
    stack = [root]
    for div in soup.select('div[class*="nodeTable-level-"]'):
        classes = div["class"]
        level = int(next(c for c in classes if c.startswith("nodeTable-level-")).rsplit("-", 1)[1])
        cells = div.find_parent("tr").find_all("td")
        sws, ects = (number(cells[2]), number(cells[3])) if len(cells) >= 4 else (None, None)
        if "course" in classes:
            nr, course_type, semester = div.select_one(".courseKey").get_text(" ", strip=True).split()
            node = {
                "course": True,
                "nr": nr,
                "type": course_type,
                "semester": semester,
                "title": div.select_one(".courseTitle a").get_text(" ", strip=True),
                "canceled": "canceledCourse" in classes,
            }
        else:
            node = {
                "course": False,
                "label": re.sub(r"\s+", " ", div.get_text(" ", strip=True)),
                "note": cells[1].get_text(" ", strip=True) if len(cells) > 1 else "",
            }
        node.update(level=level, sws=sws, ects=ects, children=[])
        while stack[-1]["level"] >= level:
            stack.pop()
        stack[-1]["children"].append(node)
        stack.append(node)
    return root


def slug(text):
    text = text.lower()
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        text = text.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def unique(keys):
    return list(dict.fromkeys(keys))


class Collector:
    """Collects the LVA entries of one academic year, keyed by type, title and ECTS."""

    def __init__(self):
        self.items = {}

    def add(self, node):
        """Register an LVA node and return its key."""
        match = ITEM_RE.match(node["label"])
        courses = [c for c in node["children"] if c["course"]]
        item_type = match.group(1) if match else courses[0]["type"]
        title = match.group(2) if match else node["label"]
        ects = node["ects"] or next((c["ects"] for c in courses if c["ects"]), None)
        sws = node["sws"] or next((c["sws"] for c in courses if c["sws"]), None)
        key = slug(f"{item_type} {title} {ects}")
        item = self.items.setdefault(key, {"key": key, "type": item_type, "title": title, "ects": ects, "sws": sws, "courses": {}})
        for c in courses:
            self.add_offering(item, c["nr"], c["type"], c["title"], {c["semester"]}, {c["semester"]} if c["canceled"] else set())
        return key

    @staticmethod
    def add_offering(item, nr, course_type, title, semesters, canceled):
        offering = item["courses"].setdefault(nr, {"nr": nr, "type": course_type, "title": title, "semesters": set(), "canceled": set()})
        offering["semesters"] |= semesters
        offering["canceled"] |= canceled

    def walk(self, node, group=(), skip_group=None):
        """Yield (group path, item key) for every LVA below node."""
        for child in node["children"]:
            if child["course"]:
                continue
            is_item = ITEM_RE.match(child["label"]) or (
                child["children"] and all(c["course"] for c in child["children"])
            )
            if is_item:
                yield group, self.add(child)
            elif not (skip_group and skip_group(child["label"])):
                yield from self.walk(child, group + (child["label"],), skip_group)

    def export(self):
        out = {}
        for key, item in sorted(self.items.items()):
            courses = [
                {**o, "semesters": sorted(o["semesters"]), "canceled": sorted(o["canceled"])}
                for o in sorted(item["courses"].values(), key=lambda o: o["nr"])
            ]
            out[key] = {**item, "courses": courses}
        return out


def module_entry(module_id, name, node, collector):
    return {
        "id": module_id,
        "name": name,
        "required": node["ects"],
        "items": unique(key for _, key in collector.walk(node)),
    }


def scrape_curriculum(tree, collector, result):
    for exam_subject in tree["children"][0]["children"]:
        label = exam_subject["label"]
        if label.startswith("Prüfungsfach Ergänzende"):
            # Only repeats all M1/M2 modules, which we already have.
            result["complementary"]["required"] = exam_subject["ects"]
        elif label.startswith("Prüfungsfach Interdisziplinäre"):
            module = exam_subject["children"][0]
            result["interdisciplinary"] = module_entry("IA", "Interdisziplinäre Ausbildung", module, collector)
        elif label.startswith("Freie Wahlfächer"):
            electives = result["electives"]
            electives["required"] = exam_subject["ects"]
            ts = re.search(r"([\d,.]+) ECTS Transferable Skills", exam_subject["note"])
            if ts:
                electives["tsRequired"] = float(ts.group(1).replace(",", "."))
            for catalog in exam_subject["children"]:
                if catalog["label"].startswith("Katalog Freie Wahlfächer"):
                    keys = [
                        key for _, key in collector.walk(catalog, skip_group=FW_EXCLUDED_GROUPS.__contains__)
                        if not FW_EXCLUDED_TITLE_RE.search(collector.items[key]["title"])
                    ]
                    result["catalogs"]["fw"] = unique(result["catalogs"]["fw"] + keys)
        elif label == "Diplomarbeit":
            result["thesisEcts"] = exam_subject["ects"]
        elif label.startswith("Prüfungsfach"):
            for module in exam_subject["children"]:
                match = MODULE_RE.match(module["label"])
                if not match:
                    continue
                _, spec_name, level, code = match.groups()
                spec = next((s for s in result["specializations"] if s["id"] == code), None)
                if spec is None:
                    spec = {"id": code, "name": spec_name}
                    result["specializations"].append(spec)
                name = module["label"].removeprefix("Modul ")
                spec[level.lower()] = module_entry(f"{level} {code}", name, module, collector)


def scrape_ts_catalog(tree, collector, catalog_name, groups):
    for group, key in collector.walk(tree["children"][0]):
        name = f"{catalog_name} – {group[0]}" if group else catalog_name
        target = next((g for g in groups if g["name"] == name), None)
        if target is None:
            target = {"name": name, "items": []}
            groups.append(target)
        target["items"] = unique(target["items"] + [key])


def scrape_year(year, use_cache):
    collector = Collector()
    result = {
        "totalEcts": 120.0,
        "thesisEcts": 30.0,
        "specializations": [],
        "complementary": {"required": 15.0},
        "electives": {"required": 9.0, "tsRequired": 4.5},
        "catalogs": {"fw": [], "ts": []},
    }
    print(f"Curriculum {year}/{year + 1}")
    scrape_curriculum(parse_tree(fetch(CURRICULUM_KEY, year, use_cache)), collector, result)
    for key, name in TS_CATALOGS:
        print(f"TS catalog {name} {year}/{year + 1}")
        scrape_ts_catalog(parse_tree(fetch(key, year, use_cache)), collector, name, result["catalogs"]["ts"])
    return result, collector


def containers(result):
    """Yield (id, item keys) for every module and catalog group; module ids start with "M" or "IA"."""
    yield "IA", result["interdisciplinary"]["items"]
    for spec in result["specializations"]:
        yield spec["m1"]["id"], spec["m1"]["items"]
        yield spec["m2"]["id"], spec["m2"]["items"]
    yield "fw", result["catalogs"]["fw"]
    for group in result["catalogs"]["ts"]:
        yield f"ts:{group['name']}", group["items"]


def match_years(old_result, old_items, new_result, new_items):
    """Map LVA keys of an older academic year onto the newest year's entries.

    TISS occasionally renames an LVA between years ("Baudynamik" became
    "Structural Dynamics") or changes its type (VO to SE); the offerings of the
    old entry still belong to the new one. Within the same module we therefore
    pair leftovers by title and ECTS, and then by type and ECTS if unambiguous.
    """
    mapping = {key: key for key in old_items if key in new_items}
    new_containers = dict(containers(new_result))
    by_title = lambda item: (slug(item["title"]), item["ects"])
    by_type = lambda item: (item["type"], item["ects"])
    for container_id, old_keys in containers(old_result):
        new_taken = set(mapping.values())
        old_open = [k for k in old_keys if k not in mapping]
        new_open = [k for k in new_containers.get(container_id, []) if k not in new_taken]
        strategies = [by_title, by_type] if container_id[0] in "IM" else [by_title]
        for signature_of in strategies:
            for signature in {signature_of(old_items[k]) for k in old_open}:
                olds = [k for k in old_open if signature_of(old_items[k]) == signature]
                news = [k for k in new_open if signature_of(new_items[k]) == signature]
                if len(olds) == 1 and len(news) == 1:
                    mapping[olds[0]] = news[0]
                    old_open.remove(olds[0])
                    new_open.remove(news[0])
    return mapping


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--cache", action="store_true", help="reuse previously fetched pages")
    args = parser.parse_args()

    today = datetime.date.today()
    newest = today.year if today.month >= 7 else today.year - 1
    years = [newest - 1, newest]

    result, collector = scrape_year(newest, args.cache)
    for year in years[:-1]:
        old_result, old_collector = scrape_year(year, args.cache)
        mapping = match_years(old_result, old_collector.items, result, collector.items)
        for old_key, new_key in mapping.items():
            if old_key != new_key:
                print(f"  {year}/{year + 1}: {old_key} -> {new_key}")
            for o in old_collector.items[old_key]["courses"].values():
                Collector.add_offering(collector.items[new_key], o["nr"], o["type"], o["title"], o["semesters"], o["canceled"])

    result = {
        "generated": today.isoformat(),
        "sources": {
            "curriculum": f"{TISS}/curriculum/public/curriculum.xhtml?key={CURRICULUM_KEY}",
            "pdf": PDF_URL,
            "academicYears": [f"{y}/{str(y + 1)[2:]}" for y in years],
        },
        **result,
        "items": collector.export(),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n")
    print(f"Wrote {OUT.relative_to(ROOT)}: {len(result['items'])} LVAs")


if __name__ == "__main__":
    main()
