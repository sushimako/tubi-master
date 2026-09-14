"use strict";

(() => {
  const C = window.CURRICULUM;
  const ITEMS = C.items;
  const STORAGE_KEY = "tubi-master:selection:v1";
  const PREFS_KEY = "tubi-master:prefs:v1";
  const LEGACY_KEY = "tuwien-curriculum-selection";
  const TISS_COURSE_URL = "https://tiss.tuwien.ac.at/course/courseDetails.xhtml";
  const EPS = 1e-9;

  // ---- Curriculum indexes --------------------------------------------------

  const SPECS = C.specializations;
  // Special case: "Konstruktiver Ingenieurbau - Tragwerke" and "- Theorie und Simulation" are too verbose.
  const shortenName = (name) => name.replace(/Konstruktiver Ingenieurbau\s*[-–]\s*/, "");
  for (const spec of SPECS) {
    spec.name = shortenName(spec.name);
    spec.m1.name = shortenName(spec.m1.name);
    spec.m2.name = shortenName(spec.m2.name);
  }
  const specById = Object.fromEntries(SPECS.map((s) => [s.id, s]));
  const moduleById = {};
  const modulesOfItem = {};
  for (const spec of SPECS) {
    for (const module of [spec.m1, spec.m2]) {
      moduleById[module.id] = module;
      for (const key of module.items) (modulesOfItem[key] ||= []).push(module.id);
    }
  }
  const iaItems = new Set(C.interdisciplinary.items);
  const tsItems = new Set(C.catalogs.ts.flatMap((g) => g.items));
  const OFFERS = Object.fromEntries(Object.entries(ITEMS).map(([key, item]) => [key, offerInfo(item)]));

  function offerInfo(item) {
    const seasons = new Set();
    let latest = null;
    for (const course of item.courses) {
      for (const semester of course.semesters) {
        if (!course.canceled.includes(semester)) seasons.add(semester.slice(-1));
        // Semester codes like "2026W" and "2027S" sort chronologically as strings.
        if (!latest || semester > latest) latest = semester;
      }
    }
    const canceled = latest !== null && item.courses
      .filter((c) => c.semesters.includes(latest))
      .every((c) => c.canceled.includes(latest));
    const search = [item.title, item.type, ...item.courses.flatMap((c) => [c.nr, c.title])].join(" ").toLowerCase();
    return { seasons, latest, canceled, search };
  }

  // ---- Formatting ----------------------------------------------------------

  const numberFormat = new Intl.NumberFormat("de-AT", { maximumFractionDigits: 2 });
  const fmt = (n) => numberFormat.format(Math.round(n * 100) / 100);
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const semesterLabel = (code) => `${code.endsWith("W") ? "WS" : "SS"} ${code.slice(2, 4)}`;
  const sumEcts = (keys) => keys.reduce((total, key) => total + ITEMS[key].ects, 0);
  const unique = (keys) => [...new Set(keys)];

  function categoryLabel(category) {
    return { IA: "Interdisziplinäre Ausbildung", M3: "M3", TS: "Transferable Skills", FW: "Freie Wahlfächer" }[category] || category;
  }

  // ---- Persistence ---------------------------------------------------------

  function readJson(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable (private mode, blocked site data): keep working in memory.
    }
  }

  function defaultState() {
    return {
      spec1: null,
      spec2: null,
      selected: Object.fromEntries(C.interdisciplinary.items.map((key) => [key, true])),
      custom: [],
    };
  }

  function loadState() {
    const saved = readJson(STORAGE_KEY);
    if (saved && typeof saved === "object") {
      return {
        ...defaultState(),
        ...saved,
        selected: saved.selected || {},
        custom: Array.isArray(saved.custom) ? saved.custom : [],
      };
    }
    const legacy = readJson(LEGACY_KEY);
    return legacy ? migrateLegacy(legacy) : defaultState();
  }

  // The former Next.js version stored its own specialization ids and used course numbers as course ids.
  function migrateLegacy(legacy) {
    const specIds = { "ki-tw": "TW", "ki-ts": "TS", gt: "GT", bm: "BM", vm: "VM", wr: "WR" };
    const itemByCourseNr = {};
    for (const [key, item] of Object.entries(ITEMS)) {
      for (const course of item.courses) itemByCourseNr[course.nr] ||= key;
    }
    const state = defaultState();
    state.spec1 = specIds[legacy.specialization1] || null;
    state.spec2 = specIds[legacy.specialization2] || null;
    for (const [id, on] of Object.entries(legacy.courses || {})) {
      const nr = /^\d{3}\.\d{3}/.exec(id);
      if (on && nr && itemByCourseNr[nr[0]]) state.selected[itemByCourseNr[nr[0]]] = true;
    }
    return state;
  }

  function loadPrefs() {
    return { semester: "all", onlySelected: false, onlyOffered: false, open: {}, ...(readJson(PREFS_KEY) || {}) };
  }

  // ---- ECTS evaluation -----------------------------------------------------

  function chosenSpecs(state) {
    const ids = unique([state.spec1, state.spec2].filter(Boolean));
    return ids.map((id) => specById[id]).filter(Boolean);
  }

  function evaluate(state) {
    const chosenModules = chosenSpecs(state).flatMap((s) => [s.m1, s.m2]);
    const current = Object.fromEntries(chosenModules.map((m) => [m.id, 0]));
    const selected = Object.keys(state.selected).filter((key) => state.selected[key] && ITEMS[key]);
    const assignment = {};
    const shared = [];

    for (const key of selected) {
      const modules = (modulesOfItem[key] || []).filter((id) => id in current);
      if (iaItems.has(key)) {
        assignment[key] = "IA";
      } else if (modules.length > 1) {
        shared.push([key, modules]);
      } else if (modules.length === 1) {
        assignment[key] = modules[0];
        current[modules[0]] += ITEMS[key].ects;
      } else if (modulesOfItem[key]) {
        assignment[key] = "M3";
      } else if (tsItems.has(key)) {
        assignment[key] = "TS";
      } else {
        assignment[key] = "FW";
      }
    }
    // An LVA listed in both chosen specializations counts once, where it is still needed most.
    const deficit = (id) => moduleById[id].required - current[id];
    for (const [key, modules] of shared) {
      const target = modules.reduce((best, id) => (deficit(id) > deficit(best) ? id : best));
      assignment[key] = target;
      current[target] += ITEMS[key].ects;
    }

    const inCategory = (category) => selected.filter((key) => assignment[key] === category);
    const customEcts = (ts) => state.custom.filter((c) => !!c.ts === ts).reduce((total, c) => total + c.ects, 0);
    // ECTS above 12/16 in the chosen M1/M2 modules reduce M3; whatever exceeds M3 still counts as Freie Wahlfächer.
    const overflow = chosenModules.reduce((total, m) => total + Math.max(0, current[m.id] - m.required), 0);
    const m3Pool = overflow + sumEcts(inCategory("M3"));
    const m3Required = C.complementary.required;
    const spill = Math.max(0, m3Pool - m3Required);
    const ts = sumEcts(inCategory("TS")) + customEcts(true);
    const fw = sumEcts(inCategory("FW")) + customEcts(false) + spill;

    const rows = [{
      id: "IA", short: "IA", label: C.interdisciplinary.name,
      current: sumEcts(inCategory("IA")), required: C.interdisciplinary.required,
    }];
    const specs = [specById[state.spec1], state.spec2 === state.spec1 ? undefined : specById[state.spec2]];
    const levelLabels = { M1: "Masterspezifische Ausbildung", M2: "Vertiefende Ausbildung" };
    for (const [level, label] of Object.entries(levelLabels)) {
      const subs = specs.map((spec, index) => {
        const m = spec?.[level.toLowerCase()];
        if (m) return { id: m.id, short: m.id, label: m.name, current: current[m.id], required: m.required, sub: true };
        return {
          id: `${level}-${index}`, short: `VR ${index + 1} (nicht gewählt)`, label: `Vertiefungsrichtung ${index + 1} (nicht gewählt)`,
          current: 0, required: SPECS[0][level.toLowerCase()].required, sub: true,
        };
      });
      // Surplus in one module does not make up for the other.
      rows.push(
        {
          id: level, short: level, label,
          current: subs.reduce((total, r) => total + Math.min(r.current, r.required), 0),
          required: subs.reduce((total, r) => total + r.required, 0),
        },
        ...subs,
      );
    }
    rows.push(
      {
        id: "M3", short: "M3", label: "Ergänzende Ausbildung",
        current: Math.min(m3Pool, m3Required), required: m3Required,
        note: overflow > EPS ? `inkl. ${fmt(Math.min(overflow, m3Required))} Überhang aus M1/M2` : "",
      },
      {
        id: "FW", short: "FW+TS", label: "Freie Wahlfächer und Transferable Skills",
        current: ts + fw, required: C.electives.required,
        note: spill > EPS ? `inkl. ${fmt(spill)} über M3 hinaus` : "",
      },
      { id: "TS", short: "davon TS", label: "Transferable Skills (mindestens)", current: ts, required: C.electives.tsRequired, sub: true },
      { id: "DA", short: "DA", label: "Diplomarbeit", current: C.thesisEcts, required: C.thesisEcts },
    );

    const total = sumEcts(selected) + customEcts(true) + customEcts(false) + C.thesisEcts;
    const complete = total >= C.totalEcts - EPS && rows.every((r) => r.current >= r.required - EPS);
    const unknown = Object.keys(state.selected).filter((key) => state.selected[key] && !ITEMS[key]);
    return { assignment, current, rows, total, complete, unknown };
  }

  // ---- State ---------------------------------------------------------------

  let state = loadState();
  const prefs = loadPrefs();
  let query = "";
  let evaluation = evaluate(state);

  const el = {
    sections: document.getElementById("sections"),
    progress: document.getElementById("progress"),
    spec1: document.getElementById("spec1"),
    spec2: document.getElementById("spec2"),
    semester: document.getElementById("semester-filter"),
    onlySelected: document.getElementById("only-selected"),
    onlyOffered: document.getElementById("only-offered"),
    search: document.getElementById("search"),
    reset: document.getElementById("reset"),
    customForm: document.getElementById("custom-form"),
    customList: document.getElementById("custom-list"),
  };

  function commit() {
    writeJson(STORAGE_KEY, state);
    render();
  }

  const savePrefs = () => writeJson(PREFS_KEY, prefs);

  // ---- Rendering -----------------------------------------------------------

  function visible(key) {
    const info = OFFERS[key];
    if (prefs.onlySelected && !state.selected[key]) return false;
    if (prefs.onlyOffered && info.seasons.size === 0) return false;
    if (prefs.semester !== "all" && !info.seasons.has(prefs.semester)) return false;
    return !query || info.search.includes(query);
  }

  function itemRow(key, category) {
    const item = ITEMS[key];
    const info = OFFERS[key];
    const on = !!state.selected[key];
    const assigned = on && evaluation.assignment[key];
    const seasons = ["W", "S"]
      .filter((s) => info.seasons.has(s))
      .map((s) => `<span class="badge sem-${s}">${s === "W" ? "WS" : "SS"}</span>`)
      .join("");
    let status = "";
    if (item.courses.length === 0) status = `<span class="badge off">nicht im Angebot</span>`;
    else if (info.canceled) status = `<span class="badge off">${semesterLabel(info.latest)} abgesagt</span>`;
    const courses = item.courses.map((c) => {
      const semesters = c.semesters.map((s) => semesterLabel(s) + (c.canceled.includes(s) ? " (abgesagt)" : ""));
      const href = `${TISS_COURSE_URL}?courseNr=${c.nr.replace(".", "")}&semester=${c.semesters[c.semesters.length - 1]}`;
      return `<a class="nr" href="${href}" target="_blank" rel="noopener" title="${esc(`${c.nr} ${c.type} ${c.title}: ${semesters.join(", ")}`)}">${c.nr}</a>`;
    }).join("");
    const counted = assigned && assigned !== category ? `<span class="counted">zählt für ${esc(categoryLabel(assigned))}</span>` : "";
    return `<tr data-key="${key}" class="${on ? "on" : ""}${info.seasons.size ? "" : " muted"}">
      <td class="cb"><input type="checkbox"${on ? " checked" : ""} aria-label="${esc(item.title)}"></td>
      <td><div class="name">${esc(item.title)}</div><div class="meta"><span class="badge type">${item.type}</span>${seasons}${status}${courses}${counted}</div></td>
      <td class="num ects">${fmt(item.ects)}</td>
    </tr>`;
  }

  function table(keys, category) {
    const rows = keys.filter(visible).map((key) => itemRow(key, category)).join("");
    if (!rows) return `<p class="empty">Keine LVAs für die aktuellen Filter.</p>`;
    return `<div class="table-wrap"><table>
      <thead><tr><th></th><th>LVA</th><th class="num">ECTS</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  }

  function progressBar(current, required) {
    const percent = required ? Math.min(100, (current / required) * 100) : 100;
    return `<div class="bar${current >= required - EPS ? " done" : ""}"><span style="width:${percent}%"></span></div>`;
  }

  function scoreHeader(title, current, required, hint = "") {
    return `<header>
        <div>${title ? `<h3>${esc(title)}</h3>` : ""}${hint ? `<p class="hint">${hint}</p>` : ""}</div>
        <div class="score">${fmt(current)}<small> / ${fmt(required)} ECTS</small></div>
      </header>
      ${progressBar(current, required)}`;
  }

  // M1 or M2, grouped by the chosen specializations.
  function levelSection(level, title, chosen) {
    const modules = chosen.map((spec) => spec[level]);
    const { current, required } = evaluation.rows.find((r) => r.id === level.toUpperCase());
    const subgroups = modules.map((m, i) => `<div class="subgroup">
        ${scoreHeader(`${chosen[i].name} (${m.id})`, evaluation.current[m.id], m.required)}
        ${table(m.items, m.id)}
      </div>`).join("");
    const missing = chosen.length < 2
      ? `<p class="notice">Wähle oben ${chosen.length ? "eine zweite Vertiefungsrichtung" : "zwei Vertiefungsrichtungen"}, um die LVAs zu sehen.</p>`
      : "";
    return `<h2 class="section-title">${title}</h2>
      <section class="card">${scoreHeader("", current, required)}${subgroups}${missing}</section>`;
  }

  function group(id, title, keys, category) {
    const matches = keys.filter(visible).length;
    if (matches === 0 && (query || prefs.onlySelected)) return "";
    const selectedEcts = sumEcts(keys.filter((key) => state.selected[key] && ITEMS[key]));
    const open = query ? matches > 0 : !!prefs.open[id];
    return `<details class="group" data-group="${id}"${open ? " open" : ""}>
      <summary>
        <span class="summary-title">${esc(title)}</span>
        <span class="summary-meta">${selectedEcts ? `${fmt(selectedEcts)} ECTS gewählt · ` : ""}${keys.length} LVAs</span>
      </summary>
      ${open ? table(keys, category) : ""}
    </details>`;
  }

  function render() {
    evaluation = evaluate(state);
    const row = (id) => evaluation.rows.find((r) => r.id === id);
    const chosen = chosenSpecs(state);
    const html = [];

    if (evaluation.unknown.length) {
      html.push(`<div class="notice">
        ${evaluation.unknown.length} gespeicherte LVA(s) sind im aktuellen Studienplan nicht mehr enthalten und werden nicht gezählt.
        <button type="button" data-action="drop-unknown">Entfernen</button>
      </div>`);
    }

    html.push(
      `<h2 class="section-title">${esc(C.interdisciplinary.name)}</h2>
      <section class="card">
        ${scoreHeader("", row("IA").current, C.interdisciplinary.required)}
        ${table(C.interdisciplinary.items, "IA")}
      </section>`,
      levelSection("m1", "Masterspezifische Ausbildung (M1)", chosen),
      levelSection("m2", "Vertiefende Ausbildung (M2)", chosen),
    );

    const m3 = row("M3");
    html.push(`<h2 class="section-title">Ergänzende Ausbildung (M3)</h2>
      <section class="card">
        ${scoreHeader("", m3.current, m3.required, `Noch nicht gewählte LVAs aus allen M1- und M2-Modulen.
          ECTS, die in den gewählten Modulen über 12 bzw. 16 ECTS hinaus absolviert werden, verringern den Umfang von M3.
          ${m3.note ? `Aktuell ${esc(m3.note)}.` : ""}`)}
        ${SPECS.filter((s) => !chosen.includes(s))
          .map((s) => group(`m3-${s.id}`, s.name, unique([...s.m1.items, ...s.m2.items]), "M3"))
          .join("")}
      </section>`);

    const fw = row("FW");
    const ts = row("TS");
    html.push(`<h2 class="section-title">Freie Wahlfächer und Transferable Skills</h2>
      <section class="card">
        ${scoreHeader("", fw.current, fw.required, `Frei wählbar aus dem Lehrangebot aller anerkannten Universitäten,
          davon mindestens ${fmt(ts.required)} ECTS Transferable Skills. Die Kataloge sind die Empfehlungen aus TISS.`)}
        <p class="subscore${ts.current >= ts.required - EPS ? " done" : ""}">davon Transferable Skills: ${fmt(ts.current)} / ${fmt(ts.required)} ECTS</p>
        <h4>Transferable Skills</h4>
        ${C.catalogs.ts.map((g, i) => group(`ts-${i}`, g.name, g.items, "TS")).join("")}
        <h4>Freie Wahlfächer</h4>
        ${group("fw", "Katalog Freie Wahlfächer – Bauingenieurwesen", C.catalogs.fw, "FW")}
      </section>`);

    el.sections.innerHTML = html.join("");
    renderCustom();
    renderProgress();
    syncControls();
  }

  function renderCustom() {
    el.customList.innerHTML = state.custom.length
      ? state.custom.map((c) => `<li>
          <span class="custom-title">${esc(c.title)}</span>
          <span class="badge${c.ts ? " ts" : ""}">${c.ts ? "TS" : "FW"}</span>
          <span class="num">${fmt(c.ects)} ECTS</span>
          <button type="button" class="link" data-remove="${esc(c.id)}">entfernen</button>
        </li>`).join("")
      : `<li class="empty">Noch keine eigenen LVAs.</li>`;
  }

  function renderProgress() {
    const { rows, total, complete } = evaluation;
    const expanded = el.progress.classList.contains("expanded");
    el.progress.classList.toggle("complete", complete);
    el.progress.innerHTML = `
      <button type="button" class="total" data-action="toggle-progress" aria-expanded="${expanded}">
        <span>Gesamt</span>
        <span class="total-value">${fmt(total)} / ${fmt(C.totalEcts)} ECTS</span>
        ${progressBar(total, C.totalEcts)}
      </button>
      <ul>
        ${rows.map((r) => `<li class="${r.current >= r.required - EPS ? "done" : ""}${r.sub ? " sub" : ""}" title="${esc(r.label)}">
          <div class="row">
            <span class="short">${esc(r.short)}</span>
            <span class="value">${fmt(r.current)} / ${fmt(r.required)}${r.current > r.required + EPS ? `<sup>+${fmt(r.current - r.required)}</sup>` : ""}</span>
          </div>
          ${progressBar(r.current, r.required)}
          ${r.note ? `<small>${esc(r.note)}</small>` : ""}
        </li>`).join("")}
      </ul>
      <p class="progress-foot">${complete ? "Alle Anforderungen erfüllt." : ""}</p>`;
  }

  function syncControls() {
    el.spec1.value = state.spec1 || "";
    el.spec2.value = state.spec2 || "";
    for (const [select, other] of [[el.spec1, state.spec2], [el.spec2, state.spec1]]) {
      for (const option of select.options) option.disabled = option.value !== "" && option.value === other;
    }
    for (const button of el.semester.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.value === prefs.semester));
    }
    el.onlySelected.checked = prefs.onlySelected;
    el.onlyOffered.checked = prefs.onlyOffered;
  }

  // ---- Events --------------------------------------------------------------

  const specOptions = `<option value="">– auswählen –</option>` +
    SPECS.map((s) => `<option value="${s.id}">${esc(s.name)} (${s.id})</option>`).join("");
  el.spec1.innerHTML = specOptions;
  el.spec2.innerHTML = specOptions;

  el.sections.addEventListener("click", (event) => {
    if (event.target.closest("a, summary")) return;
    if (event.target.closest("[data-action=drop-unknown]")) {
      for (const key of evaluation.unknown) delete state.selected[key];
      commit();
      return;
    }
    const row = event.target.closest("tr[data-key]");
    if (!row) return;
    const key = row.dataset.key;
    if (state.selected[key]) delete state.selected[key];
    else state.selected[key] = true;
    commit();
  });

  // Catalog groups render their table lazily, so opening one needs a render.
  el.sections.addEventListener("toggle", (event) => {
    const id = event.target.dataset?.group;
    if (!id || query || !!prefs.open[id] === event.target.open) return;
    prefs.open[id] = event.target.open;
    savePrefs();
    render();
  }, true);

  el.spec1.addEventListener("change", () => {
    state.spec1 = el.spec1.value || null;
    commit();
  });
  el.spec2.addEventListener("change", () => {
    state.spec2 = el.spec2.value || null;
    commit();
  });

  el.semester.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    prefs.semester = button.dataset.value;
    savePrefs();
    render();
  });
  el.onlySelected.addEventListener("change", () => {
    prefs.onlySelected = el.onlySelected.checked;
    savePrefs();
    render();
  });
  el.onlyOffered.addEventListener("change", () => {
    prefs.onlyOffered = el.onlyOffered.checked;
    savePrefs();
    render();
  });
  el.search.addEventListener("input", () => {
    query = el.search.value.trim().toLowerCase();
    render();
  });

  el.reset.addEventListener("click", () => {
    if (!confirm("Möchtest du wirklich alle Auswahlen zurücksetzen?")) return;
    state = defaultState();
    commit();
  });

  el.customForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(el.customForm);
    const title = String(data.get("title")).trim();
    const ects = parseFloat(String(data.get("ects")).replace(",", "."));
    if (!title || !(ects > 0)) return;
    state.custom.push({ id: Date.now().toString(36), title, ects, ts: data.get("ts") === "on" });
    el.customForm.reset();
    commit();
  });
  el.customList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    state.custom = state.custom.filter((c) => c.id !== button.dataset.remove);
    commit();
  });

  el.progress.addEventListener("click", (event) => {
    if (!event.target.closest("[data-action=toggle-progress]")) return;
    el.progress.classList.toggle("expanded");
    renderProgress();
  });

  // Keep several open tabs in sync.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    state = loadState();
    render();
  });

  render();
})();
