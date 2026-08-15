importScripts('utils/constants.js');

chrome.runtime.onInstalled.addListener(async () => {
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    await chrome.storage.sync.set(settings);
    console.log("[Auto Copy] Default settings initialized.");
});

console.log("[Auto Copy] Background service worker started.");