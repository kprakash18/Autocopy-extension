importScripts('utils/constants.js', 'utils/storage.js', 'utils/siteAccess.js');

async function updateExtensionIcon(tabId, url) {
    const inactivePath = {
        16: "icons/icon-disabled-16.png",
        32: "icons/icon-disabled-32.png",
        48: "icons/icon-disabled-48.png",
        128: "icons/icon-disabled-128.png"
    };

    const activePath = {
        16: "icons/icon-enabled-16.png",
        32: "icons/icon-enabled-32.png",
        48: "icons/icon-enabled-48.png",
        128: "icons/icon-enabled-128.png"
    };

    if (!url) {
        await chrome.action.setIcon({ tabId, path: inactivePath });
        await chrome.action.setBadgeText({ tabId, text: "OFF" });
        await chrome.action.setBadgeBackgroundColor({ tabId, color: "#9ca3af" });
        return;
    }

    let hostname = "";
    try {
        hostname = new URL(url).hostname;
    } catch {
        hostname = "";
    }

    const settings = await getSettings();
    const active = shouldShowActiveIcon(settings, hostname);

    await chrome.action.setIcon({
        tabId,
        path: active ? activePath : inactivePath
    });
    await chrome.action.setBadgeText({ tabId, text: active ? "ON" : "OFF" });
    await chrome.action.setBadgeBackgroundColor({ tabId, color: active ? "#22c55e" : "#9ca3af" });
}

async function updateActiveTabIcon() {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length && tabs[0].id) {
            await updateExtensionIcon(tabs[0].id, tabs[0].url);
        }
    } catch (error) {
        console.error("[Auto Copy] Failed to update active tab icon:", error);
    }
}

chrome.runtime.onInstalled.addListener(async () => {
    const settings = await getSettings();
    await saveSettings(settings);
    await updateActiveTabIcon();
    console.log("[Auto Copy] Default settings initialized.");
});

chrome.commands.onCommand.addListener(async (command) => {
    if (command !== "toggle-auto-copy") return;

    try {
        const settings = await getSettings();
        await updateSetting("enabled", !settings.enabled);
    } catch (error) {
        console.error("[Auto Copy] Failed to toggle enabled setting via command:", error);
    }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    try {
        const tab = await chrome.tabs.get(tabId);
        await updateExtensionIcon(tabId, tab.url);
    } catch (error) {
        console.error("[Auto Copy] Failed to update icon on tab activation:", error);
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!changeInfo.url && changeInfo.status !== "complete") return;
    await updateExtensionIcon(tabId, tab.url || changeInfo.url);
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName !== "sync") return;

    if (!changes.enabled && !changes.siteAccessMode && !changes.allowedSites) {
        return;
    }

    await updateActiveTabIcon();
});

updateActiveTabIcon();

console.log("[Auto Copy] Background service worker started.");