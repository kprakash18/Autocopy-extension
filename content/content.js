let settings = DEFAULT_SETTINGS;
let lastCopiedText = "";

async function loadSettings() {
    settings = await getSettings();
}

async function handleSelection(selectedText) {
    if (!selectedText) return;
    if (!settings.enabled) return;
    if (settings.preventDuplicates && selectedText === lastCopiedText) return;

    const copied = await copyToClipboard(selectedText);
    if (!copied) return;

    lastCopiedText = selectedText;
    await addToClipboardHistory(selectedText);

    if (settings.showToast) {
        showToast("✓ Copied to clipboard");
    }
}

const handleSelectionChange = debounce(() => {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    console.log("[Auto Copy] Text selected:", selectedText);
    handleSelection(selectedText);
}, SELECTION_DEBOUNCE_MS);

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") return;

    for (const key of Object.keys(changes)) {
        if (key in settings) {
            settings[key] = changes[key].newValue;
        }
    }
});

document.addEventListener("selectionchange", handleSelectionChange);
loadSettings();