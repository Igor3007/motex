document
  .querySelectorAll('[data-slider="splide-services"]')
  .forEach((el) => {
    let sliderServices = new Splide('[data-slider="splide-services"]', {
      type: 'slide',
      rewind: true,
      arrows: false,
      pagination: false,
      gap: 12,
      fixedWidth: '156px',
      autoHeight: false,
      start: 0,
      updateOnMove: true,
      drag: true,
      flickPower: 300,
      snap: true,
      focus: 'left',
      easing: 'ease-out',
      speed: 400,
      mediaQuery: 'min',
      breakpoints: {

        575.98: {
          gap: 16,
        },
        767.98: {
          fixedWidth: '308px',
        },
        1439.98: {
          destroy: true,
        }
      }
    });
    sliderServices.mount();
  });
