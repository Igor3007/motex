import Splide from "@splidejs/splide";

const applyServiceCardAnimation = (el) => {
  const video = el.querySelector('video');

  el.addEventListener('mouseenter', (e) => {
    el.classList.add('playing');
    video.play();
  });

  el.addEventListener('mouseleave', (e) => {
    el.classList.remove('playing');
    // остановим видео после появления картинки (css transition)
    setTimeout(() => {
      video.pause(); video.currentTime = 0;
    }, 500);
  })
}

const initAnimatedCards = () => {
  document.querySelectorAll('.card-service-a').forEach((el) => {
    applyServiceCardAnimation(el);
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
