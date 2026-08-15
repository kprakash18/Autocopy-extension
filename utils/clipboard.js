async function copyToClipboard(text) {
    if (!text) return false;
    try {
        await navigator.clipboard.writeText(text);

        console.log("[Auto Copy] Text copied successfully.");

        return true;
    } catch (error) {
        console.error("[Auto Copy] Failed to copy text:", error);

        return false;
    }
}