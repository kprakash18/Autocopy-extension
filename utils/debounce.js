
function debounce(callback, delayTime){
    let timeoutId; 
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delayTime);
    }
}