const enabledInput = document.getElementById("enabled");
const showToastInput = document.getElementById("showToast");
const preventDuplicatesInput = document.getElementById("preventDuplicates");

async function loadPopupSettings() {
    const settings = await getSettings();

    enabledInput.checked = settings.enabled;
    showToastInput.checked = settings.showToast;
    preventDuplicatesInput.checked = settings.preventDuplicates;
}

async function handleSettingChange(event) {
    const settingName = event.target.id;
    const value = event.target.checked;

    await updateSetting(settingName, value);
}

enabledInput.addEventListener("change", handleSettingChange);
showToastInput.addEventListener("change", handleSettingChange);
preventDuplicatesInput.addEventListener("change", handleSettingChange);

loadPopupSettings();