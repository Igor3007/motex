const sendSelectedText = () => {
  const selectedText = window.getSelection().toString().trim();

  let popup = new afLightbox({
    mobileInBottom: true,
  });

  popup.open('<div class="af-loading" ></div>', () => {
    fetch('/pages/_popup-article-feedback.html')
      .then(res => res.text())
      .then(html => {
        let out;
        if (selectedText) {
          out = html.replace(
            '{{text}}',
            `<fieldset><legend>Текст</legend><textarea readonly class="selected-text">${selectedText}</textarea></fieldset>`);
        } else {
          out = html.replace('{{text}}','');
        }
        popup.changeContent(out);
      })
      .catch(err => console.error(err));
  });

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

document
  .querySelectorAll('[data-slider="splide-read-more"]')
  .forEach(slider => {
    let _slider = new Splide(slider, {
      type: 'slide',
      rewind: true,
      arrows: false,
      arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
      pagination: false,
      gap: 12,
      fixedWidth: '156px',
      autoHeight: false,
      updateOnMove: true,
      mediaQuery: 'min',
      breakpoints: {
        767.98: {
          gap: 16,
          fixedWidth: '308px',
        },
        1023: {
          arrows: true
        },
        1439.98: {
          perPage: 4,
          perMove: 1,
        },
      }
    });

    _slider.mount();
  });
