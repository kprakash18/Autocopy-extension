let settings = DEFAULT_SETTINGS;
let lastCopiedText = "";

async function loadSettings() {
    if (!chrome?.runtime?.id) return;
    settings = await getSettings();
}

async function handleSelection(selectedText) {
    if (!chrome?.runtime?.id) return;
    if (!selectedText) return;
    if (!settings.enabled) return;
    if (!isSiteAllowed(window.location.hostname, settings)) return;
    if (settings.preventDuplicates && selectedText === lastCopiedText) return;

    const copied = await copyToClipboard(selectedText);
    if (!copied) return;

    lastCopiedText = selectedText;

    if (settings.historyEnabled) {
        try {
            await addToClipboardHistory(selectedText);
        } catch (error) {
            console.error("[Auto Copy] Failed to save clipboard history:", error);
        }
    }

    if (settings.showToast) {
        showToast("✓ Copied to clipboard");
    }
}

const handleSelectionChange = debounce(() => {
    if (!chrome?.runtime?.id) return;
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    handleSelection(selectedText);
}, SELECTION_DEBOUNCE_MS);

if (chrome?.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "sync") return;

        for (const key of Object.keys(changes)) {
            if (key in settings) {
                settings[key] = changes[key].newValue;
            }
        }

        if (changes.enabled) {
            showToast(changes.enabled.newValue ? "Auto Copy enabled" : "Auto Copy disabled");
        }
    });
}

document.addEventListener("selectionchange", handleSelectionChange);
loadSettings();