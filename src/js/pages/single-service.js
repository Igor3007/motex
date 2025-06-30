import Splide from "@splidejs/splide";
import { afLightbox } from "../components/af-lightbox";

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

document
  .querySelectorAll('[data-action="modal"]')
  .forEach((el) => {
    el.addEventListener('click', () => {
      let popup = new afLightbox({
        mobileInBottom: true,
      });

      popup.open('<div class="af-loading" ></div>', () => {
        fetch('/pages/_popup-service.html')
          .then(res => res.text())
          .then(html => {
            popup.changeContent(html);
          })
          .catch(err => console.error(err));
      });

    });
  });

/* set count of children to spawn right column whole grid height */
document
.querySelectorAll('.single-service__content')
.forEach((el) => {
  const {childElementCount} = el;
  el.style.setProperty('--content-rows',childElementCount);
});
