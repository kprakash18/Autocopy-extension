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

// ── Clipboard history (chrome.storage.local) ───────────────

async function getClipboardHistory() {
    const result = await chrome.storage.local.get(HISTORY_KEY);
    const history = result[HISTORY_KEY];
    return Array.isArray(history) ? history : [];
}

async function addToClipboardHistory(text) {
    if (!text) return;

    const history = await getClipboardHistory();

    const updated = [
        { id: crypto.randomUUID(), text, timestamp: Date.now() },
        ...history.filter(item => item.text !== text)
    ].slice(0, MAX_HISTORY);

    await chrome.storage.local.set({ [HISTORY_KEY]: updated });
}

async function deleteFromClipboardHistory(id) {
    const history = await getClipboardHistory();
    await chrome.storage.local.set({
        [HISTORY_KEY]: history.filter(item => item.id !== id)
    });
}

async function clearClipboardHistory() {
    await chrome.storage.local.remove(HISTORY_KEY);
}