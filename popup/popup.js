// ── DOM refs ──────────────────────────────────────────────

const historyView      = document.getElementById("historyView");
const settingsView     = document.getElementById("settingsView");
const settingsBtn      = document.getElementById("settingsBtn");
const backBtn          = document.getElementById("backBtn");
const historyList      = document.getElementById("historyList");
const historyEmpty     = document.getElementById("historyEmpty");
const clearHistoryBtn  = document.getElementById("clearHistoryBtn");

const enabledInput           = document.getElementById("enabled");
const showToastInput         = document.getElementById("showToast");
const preventDuplicatesInput = document.getElementById("preventDuplicates");
const historyEnabledInput    = document.getElementById("historyEnabled");

// ── View switching ─────────────────────────────────────────

function showView(view) {
    historyView.hidden  = view !== "history";
    settingsView.hidden = view !== "settings";
}

settingsBtn.addEventListener("click", () => showView("settings"));
backBtn.addEventListener("click",     () => { showView("history"); loadHistory(); });

// ── Settings ───────────────────────────────────────────────

async function loadPopupSettings() {
    const settings = await getSettings();

    enabledInput.checked           = settings.enabled;
    showToastInput.checked         = settings.showToast;
    preventDuplicatesInput.checked = settings.preventDuplicates;
    historyEnabledInput.checked    = settings.historyEnabled;
}

async function handleSettingChange(event) {
    await updateSetting(event.target.id, event.target.checked);
}

enabledInput.addEventListener("change",           handleSettingChange);
showToastInput.addEventListener("change",         handleSettingChange);
preventDuplicatesInput.addEventListener("change", handleSettingChange);
historyEnabledInput.addEventListener("change",    handleSettingChange);

// ── History ────────────────────────────────────────────────

function formatTime(timestamp) {
    const diff    = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60)               return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)               return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)                 return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

function createHistoryItem(item) {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `
        <div class="history-text">
            <span class="history-preview"></span>
            <span class="history-time"></span>
        </div>
        <div class="history-actions">
            <button class="history-action copy" type="button" aria-label="Copy" title="Copy">⧉</button>
            <button class="history-action delete" type="button" aria-label="Delete" title="Delete">🗑</button>
        </div>
    `;

    li.querySelector(".history-preview").textContent = item.text;
    li.querySelector(".history-time").textContent    = formatTime(item.timestamp);

    const copyButton = li.querySelector(".copy");
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(item.text);
            copyButton.textContent = "✓";
            setTimeout(() => { copyButton.textContent = "⧉"; }, 1000);
        } catch (error) {
            console.error("[Auto Copy] Failed to copy history item:", error);
        }
    });

    const deleteButton = li.querySelector(".delete");
    deleteButton.addEventListener("click", async () => {
        try {
            await deleteFromClipboardHistory(item.id);
            await loadHistory();
        } catch (error) {
            console.error("[Auto Copy] Failed to delete history item:", error);
        }
    });

    return li;
}

function renderHistory(items) {
    historyList.innerHTML = "";
    historyEmpty.hidden   = items.length > 0;

    items.forEach(item => historyList.appendChild(createHistoryItem(item)));
}

async function loadHistory() {
    try {
        const settings = await getSettings();

        if (!settings.historyEnabled) {
            renderHistory([]);
            historyEmpty.textContent = "History is turned off.";
            return;
        }

        historyEmpty.textContent = "No history yet.";
        const history = await getClipboardHistory();
        renderHistory(history);
    } catch (error) {
        console.error("[Auto Copy] Failed to load clipboard history:", error);
        renderHistory([]);
    }
}

clearHistoryBtn.addEventListener("click", async () => {
    try {
        await clearClipboardHistory();
        await loadHistory();
    } catch (error) {
        console.error("[Auto Copy] Failed to clear clipboard history:", error);
    }
});

// ── Init ───────────────────────────────────────────────────

loadPopupSettings();
loadHistory();