importScripts('utils/constants.js', 'utils/storage.js');

chrome.runtime.onInstalled.addListener(async () => {
    const settings = await getSettings();
    await saveSettings(settings);
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

console.log("[Auto Copy] Background service worker started.");