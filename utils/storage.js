async function getSettings() {
    if (!chrome?.storage?.sync) return DEFAULT_SETTINGS;
    try {
        const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
        return {
            ...DEFAULT_SETTINGS,
            ...stored
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

async function saveSettings(settings) {
    if (!chrome?.storage?.sync) return;
    try {
        await chrome.storage.sync.set(settings);
    } catch {}
}

async function updateSetting(key, value) {
    if (!chrome?.storage?.sync) return;
    try {
        await chrome.storage.sync.set({ [key]: value });
    } catch {}
}

async function resetSettings() {
    if (!chrome?.storage?.sync) return;
    try {
        await chrome.storage.sync.set(DEFAULT_SETTINGS);
    } catch {}
}

// ── Clipboard history (chrome.storage.local) ───────────────

async function getClipboardHistory() {
    if (!chrome?.storage?.local) return [];
    try {
        const result = await chrome.storage.local.get(HISTORY_KEY);
        const history = result?.[HISTORY_KEY];
        return Array.isArray(history) ? history : [];
    } catch {
        return [];
    }
}

async function addToClipboardHistory(text) {
    if (!text || !chrome?.storage?.local) return;

    try {
        const history = await getClipboardHistory();

        const updated = [
            { id: crypto.randomUUID(), text, timestamp: Date.now() },
            ...history.filter(item => item.text !== text)
        ].slice(0, MAX_HISTORY);

        await chrome.storage.local.set({ [HISTORY_KEY]: updated });
    } catch {}
}

async function deleteFromClipboardHistory(id) {
    if (!id || !chrome?.storage?.local) return;
    try {
        const history = await getClipboardHistory();
        await chrome.storage.local.set({
            [HISTORY_KEY]: history.filter(item => item.id !== id)
        });
    } catch {}
}

async function clearClipboardHistory() {
    if (!chrome?.storage?.local) return;
    try {
        await chrome.storage.local.remove(HISTORY_KEY);
    } catch {}
}