import 'fslightbox';
import Splide from "@splidejs/splide";
import { TooltipAjax } from "../components/tooltip-ajax";
import { Counter } from "../components/counter";
import { ProductCalculator } from "../components/product-calculator";
import { copyToClipboard } from "../components/copy-to-clipboard";
import { ScrollNavigation } from "../components/scroll-navigation";


/* =================================================
Product preview gallery
=================================================*/

if (document.querySelector('[data-slider="preview-product-main"]')) {

    let main = new Splide('[data-slider="preview-product-main"]', {

        pagination: true,
        arrows: true,
        cover: true,
        perPage: 1,
        perMove: 1,
        arrows: true,
        arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',

    });

    let thumbnails = new Splide('[data-slider="preview-product-thumb"]', {

        isNavigation: true,
        gap: 6,
        focus: 'left',
        pagination: false,
        mediaQuery: 'min',
        perPage: 4,
        wheel: true,
        wheelSleep: 100,
        wheelMinThreshold: 50,
        perMove: 1,
        drag: 'free',
        updateOnMove: true,
        arrows: false,
        fixedWidth: '72px',

        dragMinThreshold: {
            mouse: 4,
            touch: 15,
        },
        breakpoints: {

            992.9: {

                fixedWidth: '80px',
            },

            375: {
                gap: 12,
            },



        }
    });

    main.on('active', function (slide) {
        let event = new Event("click");
        if (slide.slide.querySelector('.video__button')) {
            slide.slide.querySelector('.video__button').dispatchEvent(event);
        }
    });

    main.on('inactive', function (slide) {
        if (slide.slide.querySelector('.video video')) {
            slide.slide.querySelector('.video video').pause()
        }
    });

    main.mount();
    thumbnails.mount();
    main.sync(thumbnails);

}

/* ========================================
counter
========================================*/

let counter;

// Инициализация всех счетчиков на странице
document.querySelectorAll('[data-counter="duplicate"]').forEach(container => {
    counter = new Counter({
        container,
    });
});

/* ========================================
product Calculator
========================================*/

document.querySelectorAll('.sp-configurate__calc').forEach(container => {
    window.calculator = new ProductCalculator({
        container,
        on: {
            changeInputCount: (total) => {
                counter.setValue(total)
            }
        }
    });
})

if (document.querySelector('[data-counter="duplicate"]')) {
    document.querySelector('[data-counter="duplicate"]').addEventListener('change', e => {
        window.calculator.setCount(e.count)
    })
}

/* =======================================
copy-field
=======================================*/

copyToClipboard()

/* ======================================
scrollNavigation
======================================*/

window.addEventListener('load', () => {
    new ScrollNavigation({
        navSelector: '.sticky-bar-product__nav',
        sectionSelector: '.details-product__group',
        activeClass: 'is-active',
        offset: window.globalConfig.hgtheader + 36
    });
})

/* =======================================
Tooltip
=======================================*/

new TooltipAjax({
    el: '[data-tooltip]'
})

/* ======================================
show sp props
======================================*/

if (document.querySelector('.single-product__more--all')) {
    document.querySelectorAll('.single-product__more--all').forEach(item => {
        item.addEventListener('click', (e) => {
            e.target.closest('.details-product__content').classList.toggle('is-open')
        })
    })
}

/* ======================================
show title h1
======================================*/

function isLineClamped(element) {
    const styles = window.getComputedStyle(element);
    // Используем строковый доступ к свойству
    const lineClamp = styles['webkitLineClamp'] || styles['lineClamp'];

    if (lineClamp === 'none') return false;
    return element.scrollHeight > element.clientHeight;
}

function initLineClamp() {
    document.querySelectorAll('[data-clamp]').forEach(el => {
        if (isLineClamped(el)) {
            const btn = document.createElement('span');
            btn.textContent = 'ещё';

            btn.addEventListener('click', () => {
                el.parentNode.classList.add('is-disabled-lineclamp');
            });

            el.parentNode.append(btn);
        }
    });
}

if (document.readyState === 'complete') {
    initLineClamp();
} else {
    window.addEventListener('load', initLineClamp);
}

/* ==============================================
view all photo
============================================== */

if (document.querySelector('[data-slider="preview-product-main"]')) {

    function openGalleryProduct(index) {
        const img = document.querySelectorAll('[data-slider="preview-product-main"] img')
        const arrImage = [];

        img.forEach(image => {
            arrImage.push(image.getAttribute('src'))
        })

        const instance = new FsLightbox();
        instance.props.dots = true;
        instance.props.type = "image";
        instance.props.sources = arrImage;
        instance.open(index)
        
    }

    document.querySelectorAll('[data-slider="preview-product-main"] .splide__slide').forEach((item, index) => {
        item.addEventListener('click', e => {
            openGalleryProduct(index);
        })
    })

}

if(document.querySelector('.sp-configurate__tocart')) {
    document.querySelector('.sp-configurate__tocart').addEventListener('click', () => {
        window
    })
}

