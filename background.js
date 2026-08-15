importScripts('utils/constants.js', 'utils/storage.js');

async function updateActionIcon(enabled) {
    try {
        const path = enabled ? {
            16: "icons/icon-enabled-16.png",
            32: "icons/icon-enabled-32.png",
            48: "icons/icon-enabled-48.png",
            128: "icons/icon-enabled-128.png"
        } : {
            16: "icons/icon-disabled-16.png",
            32: "icons/icon-disabled-32.png",
            48: "icons/icon-disabled-48.png",
            128: "icons/icon-disabled-128.png"
        };

        await chrome.action.setIcon({ path });
        await chrome.action.setBadgeText({ text: enabled ? "ON" : "OFF" });
        await chrome.action.setBadgeBackgroundColor({ color: enabled ? "#22c55e" : "#9ca3af" });
    } catch (error) {
        console.error("[Auto Copy] Failed to update action icon:", error);
    }
}

chrome.runtime.onInstalled.addListener(async () => {
    const settings = await getSettings();
    await saveSettings(settings);
    await updateActionIcon(settings.enabled);
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

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.enabled) {
        updateActionIcon(changes.enabled.newValue);
    }
});

getSettings().then(settings => updateActionIcon(settings.enabled)).catch(() => {});

console.log("[Auto Copy] Background service worker started.");