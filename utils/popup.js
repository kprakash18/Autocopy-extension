
console.log("[Auto Copy] Toast utility loaded.");let toastElement = null;
let hideTimeoutId = null;

function showToast(message) {
    if (!toastElement) {
        toastElement = document.createElement("div");

        toastElement.className = "auto-copy-toast";

        document.body.appendChild(toastElement);
    }

    toastElement.textContent = message;

    toastElement.classList.add("visible");

    clearTimeout(hideTimeoutId);

    hideTimeoutId = setTimeout(() => {
        toastElement.classList.remove("visible");
    }, 1500);
}