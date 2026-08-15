function shouldShowActiveIcon(settings, hostname) {
    if (!settings.enabled) {
        return false;
    }

    return isSiteAllowed(hostname, settings);
}
