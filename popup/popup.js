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

// ── Site Access DOM refs ───────────────────────────────────

const siteAccessView      = document.getElementById("siteAccessView");
const siteAccessBtn       = document.getElementById("siteAccessBtn");
const siteAccessBackBtn   = document.getElementById("siteAccessBackBtn");
const currentHostnameEl   = document.getElementById("currentHostnameEl");
const modeAllRadio        = document.getElementById("modeAll");
const modeSelectedRadio   = document.getElementById("modeSelected");
const allowedSitesSection = document.getElementById("allowedSitesSection");
const allowedSitesList    = document.getElementById("allowedSitesList");
const addSiteBtn          = document.getElementById("addSiteBtn");

// ── View switching ─────────────────────────────────────────

function showView(view) {
    historyView.hidden    = view !== "history";
    settingsView.hidden   = view !== "settings";
    siteAccessView.hidden = view !== "siteAccess";
}

settingsBtn.addEventListener("click", () => showView("settings"));
backBtn.addEventListener("click",     () => { showView("history"); loadHistory(); });

// ── Settings ───────────────────────────────────────────────

async function loadPopupSettings() {
    try {
        const settings = await getSettings();

        enabledInput.checked           = settings.enabled;
        showToastInput.checked         = settings.showToast;
        preventDuplicatesInput.checked = settings.preventDuplicates;
        historyEnabledInput.checked    = settings.historyEnabled;
    } catch (error) {
        console.error("[Auto Copy] Failed to load settings:", error);
    }
}

async function handleSettingChange(event) {
    try {
        await updateSetting(event.target.id, event.target.checked);
    } catch (error) {
        console.error("[Auto Copy] Failed to save setting:", error);
    }
}

enabledInput.addEventListener("change",           handleSettingChange);
showToastInput.addEventListener("change",         handleSettingChange);
preventDuplicatesInput.addEventListener("change", handleSettingChange);
historyEnabledInput.addEventListener("change",    handleSettingChange);

// ── History ────────────────────────────────────────────────

// ── History Icons ──────────────────────────────────────────

const ICONS = {
    copy: `<svg class="action-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    copied: `<svg class="action-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    delete: `<svg class="action-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`
};

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
            <button class="history-action copy" type="button" aria-label="Copy" title="Copy">${ICONS.copy}</button>
            <button class="history-action delete" type="button" aria-label="Delete" title="Delete">${ICONS.delete}</button>
        </div>
    `;

    li.querySelector(".history-preview").textContent = item.text;
    li.querySelector(".history-time").textContent    = formatTime(item.timestamp);

    const copyButton = li.querySelector(".copy");
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(item.text);
            copyButton.innerHTML = ICONS.copied;
            setTimeout(() => { copyButton.innerHTML = ICONS.copy; }, 1000);
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
            historyEmpty.textContent  = "History is turned off.";
            clearHistoryBtn.hidden    = true;
            return;
        }

        clearHistoryBtn.hidden    = false;
        historyEmpty.textContent  = "No history yet.";
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

// ── Site Access ────────────────────────────────────────────

let currentHostname = "";

async function getCurrentHostname() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.url) return "";
        return new URL(tab.url).hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
}


function renderAllowedSites(sites) {
    allowedSitesList.innerHTML = "";

    sites.forEach(site => {
        const li = document.createElement("li");
        li.className = "site-item";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = site;

        const removeBtn = document.createElement("button");
        removeBtn.className  = "remove-btn";
        removeBtn.type       = "button";
        removeBtn.textContent = "×";
        removeBtn.setAttribute("aria-label", `Remove ${site}`);

        removeBtn.addEventListener("click", async () => {
            try {
                const settings = await getSettings();
                await updateSetting("allowedSites", settings.allowedSites.filter(s => s !== site));
                await loadSiteAccess();
            } catch (error) {
                console.error("[Auto Copy] Failed to remove site:", error);
            }
        });

        li.append(nameSpan, removeBtn);
        allowedSitesList.appendChild(li);
    });
}

async function loadSiteAccess() {
    try {
        const settings = await getSettings();

        currentHostnameEl.textContent  = currentHostname || "—";
        modeAllRadio.checked           = settings.siteAccessMode === "all";
        modeSelectedRadio.checked      = settings.siteAccessMode === "selected";
        allowedSitesSection.hidden     = settings.siteAccessMode !== "selected";

        if (settings.siteAccessMode === "selected") {
            renderAllowedSites(settings.allowedSites);
            const alreadyAdded = !currentHostname || settings.allowedSites.includes(currentHostname);
            addSiteBtn.disabled    = alreadyAdded;
            addSiteBtn.textContent = alreadyAdded && currentHostname
                ? "✓ Already allowed"
                : "+ Allow this website";
        }
    } catch (error) {
        console.error("[Auto Copy] Failed to load site access:", error);
    }
}

async function handleModeChange(event) {
    try {
        await updateSetting("siteAccessMode", event.target.value);
        await loadSiteAccess();
    } catch (error) {
        console.error("[Auto Copy] Failed to update site mode:", error);
    }
}

modeAllRadio.addEventListener("change",      handleModeChange);
modeSelectedRadio.addEventListener("change", handleModeChange);

addSiteBtn.addEventListener("click", async () => {
    if (!currentHostname) return;
    try {
        const settings = await getSettings();
        if (settings.allowedSites.includes(currentHostname)) return;
        await updateSetting("allowedSites", [...settings.allowedSites, currentHostname]);
        await loadSiteAccess();
    } catch (error) {
        console.error("[Auto Copy] Failed to add site:", error);
    }
});

siteAccessBtn.addEventListener("click", async () => {
    currentHostname = await getCurrentHostname();
    showView("siteAccess");
    loadSiteAccess();
});

siteAccessBackBtn.addEventListener("click", () => showView("settings"));

// ── Init ───────────────────────────────────────────────────

loadPopupSettings();
loadHistory();