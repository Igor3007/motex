import Splide from "@splidejs/splide";
import { TooltipAjax } from "../components/tooltip-ajax";
import { Counter } from "../components/counter";
import { ProductCalculator } from "../components/product-calculator";
import { copyToClipboard } from "../components/copy-to-clipboard";
import { ScrollNavigation } from "../components/scroll-navigation";

document.addEventListener('DOMContentLoaded', function (event) {
    /* =================================================
    popup product preview
    =================================================*/

    if (document.querySelector('[data-slider="preview-product-main"]')) {

        let main = new Splide('[data-slider="preview-product-main"]', {

            pagination: true,
            arrows: true,
            cover: true,
            perPage: 1,
            perMove: 1,
            arrows: false,

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

    let counter, calculator;

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

});

