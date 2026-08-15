// selecting text 
document.addEventListener('selectionchange', () => {
  const selection = document.getSelection();
  const selectedText = selection ? selection.toString() : '';

  if (selectedText.trim()) {
    console.log('User selected text:', selectedText);
  } else {
    console.log('Selection cleared');
  }
});