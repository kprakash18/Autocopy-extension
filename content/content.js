let lastCopiedText = "";

async function handleSelection(selectedText) {
    if (!selectedText) return;
    if (selectedText === lastCopiedText) return;

    const copied = await copyToClipboard(selectedText);
    if (copied) lastCopiedText = selectedText;
}

const handleSelectionChange = debounce(() => {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    console.log("[Auto Copy] Text selected:", selectedText);
    handleSelection(selectedText);
}, SELECTION_DEBOUNCE_MS);

document.addEventListener("selectionchange", handleSelectionChange);