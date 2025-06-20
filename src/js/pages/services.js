const applyAnimation = (el) => {
  const video = el.querySelector('video');

  el.addEventListener('mouseenter', (e) => {
    el.classList.add('playing');
    video.play();
  });

  el.addEventListener('mouseleave', (e) => {
    el.classList.remove('playing');
    video.pause();video.currentTime = 0;
  })
}

const initAnimatedCards = () => {
  document.querySelectorAll('.card-service-a').forEach((el) => {
    applyAnimation(el);
  })
};

const initServicesPage = () => {
  initAnimatedCards();

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
};

document.addEventListener('DOMContentLoaded', initServicesPage);
