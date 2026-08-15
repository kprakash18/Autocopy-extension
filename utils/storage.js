async function getSettings() {
    const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);

    return {
        ...DEFAULT_SETTINGS,
        ...stored
    };
}

async function saveSettings(settings) {
    await chrome.storage.sync.set(settings);
}

async function updateSetting(key, value) {
    await chrome.storage.sync.set({
        [key]: value
    });
}

async function resetSettings() {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
}