const STORAGE_KEY = "linkedin_pipeline_v1";

// Clicking the extension icon opens the pipeline tracker in a tab
chrome.action.onClicked.addListener(function() {
  chrome.tabs.create({ url: chrome.runtime.getURL("pipeline-tracker.html") });
});

// Handle messages from content script and bridge.js
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action === "open_pipeline") {
    chrome.tabs.create({ url: chrome.runtime.getURL("pipeline-tracker.html") });
    return;
  }

  if (msg.action === "save_lead" && msg.lead) {
    chrome.storage.local.get([STORAGE_KEY], function(result) {
      const leads = result[STORAGE_KEY] || [];
      leads.unshift(msg.lead);
      chrome.storage.local.set({ [STORAGE_KEY]: leads }, function() {
        sendResponse({ success: true });
      });
    });
    return true; // keep channel open for async sendResponse
  }
});
