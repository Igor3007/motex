import Splide from "@splidejs/splide";
import {afLightbox} from "../components/af-lightbox";
import {MaskInput} from "maska";

const initSlider = () => {
  document
    .querySelectorAll('[data-slider="splide-services"]')
    .forEach((el) => {
      let sliderServices = new Splide(el, {
        type: 'slide',
        rewind: true,
        arrows: false,
        arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
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
            trimSpace: true,
            drag: false,
            rewind: false,
            arrows: true,
          }
        }
      });
      sliderServices.on('resize', () => {
        sliderServices.refresh();
      })
      sliderServices.mount();
    });
}

const initForm = () => {
  const formFiles = [];
  const inputEl = document.querySelector('#files');
  const wrapper = document.querySelector('#files-list');
  new MaskInput('#tel');

  let mimeType = [
    'image/jpeg',
    'application/x-zip-compressed',
    'image/png',
    'image/svg+xml',
  ];

  const getFileExtension = (filename) => (filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2));

  const filePreview = (f, i) => (
    `<div class="file-preview" title="${f.name}" data-i="${i}">
<div class="file-preview__icon">${getFileExtension(f.name)}</div>
<div class="file-preview__text">${f.name}</div>
<div class="file-preview__remove icon-cross"></div>
</div>`);

  const getPreviewList = () => (formFiles.map((f, i) => filePreview(f, i)).join(""));

  const removeHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {i} = e.target.parentElement.dataset;
    formFiles.splice(parseInt(i), 1);
    wrapper.innerHTML = getPreviewList();
    document
      .querySelectorAll('.file-preview__remove')
      .forEach((el) => {
        el.addEventListener('click', removeHandler);
      })
  }

  inputEl.addEventListener('change', (e) => {
    const {files} = e.target;

    Array.from(files).forEach(file => {
      if (formFiles.length > 9) {
        alert("Достигнуто максимальное количество файлов");
        return false;
      }
      if (!mimeType.includes(file.type)) {
        alert('Не поддерживаемый тип файла ' + file.name)
        return false;
      }

      if (file.size > 50000000) {
        alert('Допустимы файлы не более 50мБ \n' + file.name)
        return false;
      }

      if (formFiles.find(f => f.name === file.name)) {
        alert('Данный файл уже добавлен: ' + file.name);
        return false;
      }

      formFiles.push(file);
    })
    /* remove old elements and listeners (!) */
    document
      .querySelectorAll('.file-preview__remove')
      .forEach(x => x.remove());
    wrapper.innerHTML = getPreviewList();
    /* add new click handlers */
    document
      .querySelectorAll('.file-preview__remove')
      .forEach((el) => {
        el.addEventListener('click', removeHandler);
      })
  })
}

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
          .then(() => {
            initForm();
          })
          .catch(err => console.error(err));
      });
    });
  });

document.addEventListener("DOMContentLoaded", () => {

  initSlider();

  /* set count of children to spawn right column whole grid height */
  document
    .querySelectorAll('.single-service__content')
    .forEach((el) => {
      const {childElementCount} = el;
      el.style.setProperty('--content-rows', childElementCount);
    });

});
