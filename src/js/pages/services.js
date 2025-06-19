if (document.querySelector('[data-slider="advantages"]')) {
  new Splide('[data-slider="advantages"]', {
    arrows: false,
    pagination: false,
    fixedWidth: '240px',
    gap: 12,
    mediaQuery: 'min',
    breakpoints: {
      575.98: {
        gap: 16,
      },
      767.98: {
        fixedWidth: '308px',
      }
    }
  }).mount();
}
