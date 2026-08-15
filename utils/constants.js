const SELECTION_DEBOUNCE_MS = 500;

const DEFAULT_SETTINGS = {
    enabled: true,
    showToast: true,
    historyEnabled: true,
    preventDuplicates: true,
    siteAccessMode: "all",
    allowedSites: []
};

const HISTORY_KEY = "clipboardHistory";
const MAX_HISTORY = 5;