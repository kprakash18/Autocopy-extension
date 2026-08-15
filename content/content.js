document.addEventListener("selectionchange", async () => {
    const selection = window.getSelection();

    if (!selection) return ;

    const selectedText = selection.toString().trim();

    if (!selectedText)  return ;

    console.log("[Auto Copy] Text selected:", selectedText);

    await copyToClipboard(selectedText);
});