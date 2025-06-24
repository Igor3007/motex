const sendSelectedText = () => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    alert('Выделенный текст: ' + selectedText);
  } else {
    alert('Текст не выделен');
  }
}

document
  .addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'Enter') {
      sendSelectedText();
    }
  });

document
  .querySelectorAll('[data-action="send-error"]')
  .forEach(element => {
    element.addEventListener('click', sendSelectedText);
  });
