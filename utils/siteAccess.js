function normalizeDomain(hostname) {
    if (!hostname) return "";

    return hostname
        .toLowerCase()
        .replace(/^www\./, "");
}

function isSiteAllowed(hostname, settings) {
    const domain = normalizeDomain(hostname);

    if (!domain) {
        return false;
    }

    if (settings.siteAccessMode === "all") {
        return true;
    }

    return settings.allowedSites.includes(domain);
}
