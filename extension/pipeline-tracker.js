const STORAGE_KEY = "linkedin_pipeline_v1";
let leads = [];

function loadAndRender() {
  chrome.storage.local.get([STORAGE_KEY], function(result) {
    leads = result[STORAGE_KEY] || [];
    renderPipeline();
    renderReview();
  });
}

chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === "local" && changes[STORAGE_KEY]) {
    leads = changes[STORAGE_KEY].newValue || [];
    renderPipeline();
    renderReview();
  }
});

function saveLead(lead) {
  chrome.storage.local.get([STORAGE_KEY], function(result) {
    const existing = result[STORAGE_KEY] || [];
    existing.unshift(lead);
    chrome.storage.local.set({ [STORAGE_KEY]: existing });
  });
}

function updateLead(index, updates) {
  chrome.storage.local.get([STORAGE_KEY], function(result) {
    const list = result[STORAGE_KEY] || [];
    if (list[index]) Object.assign(list[index], updates);
    chrome.storage.local.set({ [STORAGE_KEY]: list });
  });
}

function deleteLead(index) {
  chrome.storage.local.get([STORAGE_KEY], function(result) {
    const list = result[STORAGE_KEY] || [];
    list.splice(index, 1);
    chrome.storage.local.set({ [STORAGE_KEY]: list });
  });
}

function getStringLabel(id) {
  const s = CONFIG.strings.find(function(s) { return s.id === Number(id); });
  return s ? "#" + s.id + " " + s.label : "#" + id;
}

function el(tag, attrs, text) {
  const e = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(function(kv) { e.setAttribute(kv[0], kv[1]); });
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderPipeline() {
  const view = document.getElementById("pipeline-view");
  while (view.firstChild) view.removeChild(view.firstChild);

  if (leads.length === 0) {
    const p = el("p", { class: "empty" }, "No leads yet — save one from LinkedIn using the + button on any post.");
    view.appendChild(p);
    return;
  }

  const table = el("table");
  const thead = el("thead");
  const hrow = el("tr");
  ["String", "Post", "Poster Title", "Score", "Status", "Date", ""].forEach(function(h) {
    hrow.appendChild(el("th", {}, h));
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  const tbody = el("tbody");
  leads.forEach(function(lead, i) {
    const tr = el("tr");

    // String
    tr.appendChild(el("td", {}, getStringLabel(lead.stringId)));

    // Post URL
    const urlTd = el("td");
    if (lead.url) {
      const a = el("a", { class: "url-link", href: lead.url, target: "_blank", rel: "noopener" }, "View ↗");
      urlTd.appendChild(a);
    } else {
      urlTd.textContent = "—";
    }
    tr.appendChild(urlTd);

    // Poster title
    tr.appendChild(el("td", {}, lead.posterTitle || "—"));

    // Score badge
    const scoreTd = el("td");
    const badge = el("span", { class: "score-badge " + (Number(lead.score) >= CONFIG.qualifiedThreshold ? "qualified" : "skip") }, lead.score);
    scoreTd.appendChild(badge);
    tr.appendChild(scoreTd);

    // Status select
    const statusTd = el("td");
    const sel = el("select", { class: "status-select", "data-index": String(i) });
    CONFIG.statuses.forEach(function(s) {
      const opt = el("option", { value: s }, s);
      if (lead.status === s) opt.selected = true;
      sel.appendChild(opt);
    });
    statusTd.appendChild(sel);
    tr.appendChild(statusTd);

    // Date
    tr.appendChild(el("td", {}, lead.date));

    // Delete button
    const delTd = el("td");
    const btn = el("button", { class: "del-btn", "data-index": String(i) }, "×");
    delTd.appendChild(btn);
    tr.appendChild(delTd);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  view.appendChild(table);
}

function renderReview() {
  const view = document.getElementById("review-view");
  while (view.firstChild) view.removeChild(view.firstChild);

  const byString = {};
  CONFIG.strings.forEach(function(s) { byString[s.id] = { label: s.label, tier: s.tier, hits: 0, qualified: 0 }; });
  leads.forEach(function(lead) {
    if (byString[lead.stringId]) {
      byString[lead.stringId].hits++;
      if (Number(lead.score) >= CONFIG.qualifiedThreshold) byString[lead.stringId].qualified++;
    }
  });

  const rows = Object.entries(byString).filter(function(e) { return e[1].hits > 0; })
    .sort(function(a, b) { return b[1].hits - a[1].hits; });

  if (rows.length === 0) {
    view.appendChild(el("p", { class: "empty" }, "No data yet."));
    return;
  }

  const table = el("table", { class: "review-table" });
  const thead = el("thead");
  const hrow = el("tr");
  ["#", "String", "Tier", "Hits", "Qualified", "ICP %", "Day 5 verdict"].forEach(function(h) {
    hrow.appendChild(el("th", {}, h));
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  const tbody = el("tbody");
  rows.forEach(function(e) {
    const id = e[0], d = e[1];
    const pct = d.hits > 0 ? Math.round((d.qualified / d.hits) * 100) : 0;
    const tr = el("tr");
    tr.appendChild(el("td", {}, id));
    tr.appendChild(el("td", {}, d.label));
    tr.appendChild(el("td", {}, "T" + d.tier));
    tr.appendChild(el("td", {}, String(d.hits)));
    tr.appendChild(el("td", {}, String(d.qualified)));
    tr.appendChild(el("td", {}, pct + "%"));
    const verdictTd = el("td");
    if (d.hits >= 3 && pct < 60) {
      verdictTd.appendChild(el("span", { class: "kill-flag" }, "Kill / replace"));
    } else if (d.hits >= 3 && pct >= 60) {
      verdictTd.appendChild(el("span", { class: "ok-flag" }, "Keep"));
    } else {
      const s = el("span", { style: "color:#aaa;font-size:11px" }, "Need more data");
      verdictTd.appendChild(s);
    }
    tr.appendChild(verdictTd);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  view.appendChild(table);
}

// Event delegation — no inline handlers
document.addEventListener("change", function(e) {
  if (e.target.classList.contains("status-select")) {
    updateLead(Number(e.target.dataset.index), { status: e.target.value });
  }
});

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("del-btn")) {
    deleteLead(Number(e.target.dataset.index));
  }
});

document.getElementById("add-btn").addEventListener("click", function() {
  const stringId = Number(document.getElementById("new-string-id").value);
  const url = document.getElementById("new-url").value.trim();
  const posterTitle = document.getElementById("new-title").value.trim();
  const score = document.getElementById("new-score").value.trim();
  if (!posterTitle && !url) return;
  saveLead({ stringId, url, posterTitle, score: score || "0", status: "hit", date: new Date().toISOString().slice(0, 10) });
  document.getElementById("new-url").value = "";
  document.getElementById("new-title").value = "";
  document.getElementById("new-score").value = "";
});

document.getElementById("btn-pipeline").addEventListener("click", function() {
  document.getElementById("pipeline-view").style.display = "";
  document.getElementById("review-view").style.display = "none";
  document.getElementById("btn-pipeline").classList.add("active");
  document.getElementById("btn-review").classList.remove("active");
});

document.getElementById("btn-review").addEventListener("click", function() {
  document.getElementById("pipeline-view").style.display = "none";
  document.getElementById("review-view").style.display = "";
  document.getElementById("btn-pipeline").classList.remove("active");
  document.getElementById("btn-review").classList.add("active");
});

document.getElementById("export-btn").addEventListener("click", function() {
  if (leads.length === 0) { alert("No leads to export."); return; }
  const header = "String #,String Label,Post URL,Poster Title,ICP Score,Status,Date";
  const rows = leads.map(function(l) {
    return [l.stringId, getStringLabel(l.stringId), l.url, l.posterTitle, l.score, l.status, l.date]
      .map(function(v) { return '"' + (v || "").replace(/"/g, '""') + '"'; }).join(",");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wubbl-pipeline-" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
});

// Populate string dropdown on load
const stringSelect = document.getElementById("new-string-id");
CONFIG.strings.forEach(function(s) {
  const opt = el("option", { value: String(s.id) }, "#" + s.id + " — " + s.label);
  stringSelect.appendChild(opt);
});

loadAndRender();
