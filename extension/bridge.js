// Runs on local file:// pages — bridges chrome.storage.local to the page via postMessage
const STORAGE_KEY = "linkedin_pipeline_v1";

window.addEventListener("message", function(event) {
  if (event.source !== window || !event.data || !event.data.__wubbl) return;
  const msg = event.data;

  if (msg.action === "get_leads") {
    chrome.storage.local.get([STORAGE_KEY], function(r) {
      window.postMessage({ __wubbl: true, action: "leads_data", leads: r[STORAGE_KEY] || [] }, "*");
    });
  } else if (msg.action === "save_lead") {
    chrome.storage.local.get([STORAGE_KEY], function(r) {
      const leads = r[STORAGE_KEY] || [];
      leads.unshift(msg.lead);
      chrome.storage.local.set({ [STORAGE_KEY]: leads }, function() {
        window.postMessage({ __wubbl: true, action: "save_confirm", success: true }, "*");
      });
    });
  } else if (msg.action === "update_lead") {
    chrome.storage.local.get([STORAGE_KEY], function(r) {
      const leads = r[STORAGE_KEY] || [];
      if (leads[msg.index]) Object.assign(leads[msg.index], msg.updates);
      chrome.storage.local.set({ [STORAGE_KEY]: leads });
    });
  } else if (msg.action === "delete_lead") {
    chrome.storage.local.get([STORAGE_KEY], function(r) {
      const leads = r[STORAGE_KEY] || [];
      leads.splice(msg.index, 1);
      chrome.storage.local.set({ [STORAGE_KEY]: leads });
    });
  } else if (msg.action === "open_pipeline") {
    chrome.runtime.sendMessage({ action: "open_pipeline" });
  }
});

// Forward storage changes to the page in real-time
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === "local" && changes[STORAGE_KEY]) {
    window.postMessage({ __wubbl: true, action: "leads_updated", leads: changes[STORAGE_KEY].newValue || [] }, "*");
  }
});

// Tell the page the bridge is live
window.postMessage({ __wubbl: true, action: "bridge_ready" }, "*");
