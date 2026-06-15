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

function renderPipeline() {
  const view = document.getElementById("pipeline-view");
  if (leads.length === 0) {
    view.innerHTML = '<p class="empty">No leads yet — save one from LinkedIn using the + button on any post.</p>';
    return;
  }
  let rows = "";
  leads.forEach(function(lead, i) {
    const statusOpts = CONFIG.statuses.map(function(s) {
      return '<option value="' + s + '"' + (lead.status === s ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
    rows += '<tr>' +
      '<td>' + getStringLabel(lead.stringId) + '</td>' +
      '<td>' + (lead.url ? '<a class="url-link" href="' + lead.url + '" target="_blank" rel="noopener">View ↗</a>' : '—') + '</td>' +
      '<td>' + (lead.posterTitle || '—') + '</td>' +
      '<td><span class="score-badge ' + (Number(lead.score) >= CONFIG.qualifiedThreshold ? 'qualified' : 'skip') + '">' + lead.score + '</span></td>' +
      '<td><select class="status-select" data-index="' + i + '">' + statusOpts + '</select></td>' +
      '<td>' + lead.date + '</td>' +
      '<td><button class="del-btn" data-index="' + i + '">×</button></td>' +
      '</tr>';
  });
  view.innerHTML = '<table><thead><tr><th>String</th><th>Post</th><th>Poster Title</th><th>Score</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>';
}

function renderReview() {
  const view = document.getElementById("review-view");
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
  if (rows.length === 0) { view.innerHTML = '<p class="empty">No data yet.</p>'; return; }
  let html = '<table class="review-table"><thead><tr><th>#</th><th>String</th><th>Tier</th><th>Hits</th><th>Qualified</th><th>ICP %</th><th>Day 5 verdict</th></tr></thead><tbody>';
  rows.forEach(function(e) {
    const id = e[0], d = e[1];
    const pct = d.hits > 0 ? Math.round((d.qualified / d.hits) * 100) : 0;
    const verdict = d.hits >= 3 && pct < 60 ? '<span class="kill-flag">Kill / replace</span>'
      : d.hits >= 3 && pct >= 60 ? '<span class="ok-flag">Keep</span>'
      : '<span style="color:#aaa;font-size:11px">Need more data</span>';
    html += '<tr><td>' + id + '</td><td>' + d.label + '</td><td>T' + d.tier + '</td><td>' + d.hits + '</td><td>' + d.qualified + '</td><td>' + pct + '%</td><td>' + verdict + '</td></tr>';
  });
  view.innerHTML = html + '</tbody></table>';
}

// Event delegation — no inline handlers needed
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

// Populate string dropdown
const stringSelect = document.getElementById("new-string-id");
CONFIG.strings.forEach(function(s) {
  const opt = document.createElement("option");
  opt.value = s.id;
  opt.textContent = "#" + s.id + " — " + s.label;
  stringSelect.appendChild(opt);
});

loadAndRender();
