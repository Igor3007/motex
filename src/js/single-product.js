document.addEventListener('DOMContentLoaded', function (event) {
    /* =================================================
    popup product preview
    =================================================*/

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
        gap: 2,
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
                gap: 12,
                fixedWidth: '80px',
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

    /* =========================================
    video
    =========================================*/

    if (document.querySelector('.video')) {
        document.querySelectorAll('.video').forEach(container => {

            const video = container.querySelector('video')

            container.querySelector('.video__button').addEventListener('click', e => {
                video.play()
                video.setAttribute('controls', '')
                container.classList.add('is-play')
            })

            container.addEventListener('mouseenter', e => {
                !video.getAttribute('preload') || video.setAttribute('preload', 'true')
            })

            video.addEventListener('pause', e => {
                container.classList.add('is-pause')
                video.removeAttribute('controls')
            })
            video.addEventListener('play', e => {
                !container.classList.contains('is-pause') || container.classList.remove('is-pause')
            })
        })
    }


});

