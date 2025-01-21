function toggleTime(triggerSelector, targetSelector, className, closeOnOutsideClick = false) {
    const triggerElements = document.querySelectorAll(triggerSelector);

    if (!triggerElements.length) {
        return;
    }

    triggerElements.forEach((triggerElement) => {
        triggerElement.addEventListener('click', (event) => {
            event.stopPropagation();

            const parentContainer = triggerElement.closest('.modal-time');
            if (!parentContainer) {
                return;
            }

            const targetElement = parentContainer.querySelector(targetSelector);
            if (!targetElement) {
                return;
            }

            triggerElement.classList.toggle(className);
            targetElement.classList.toggle(className);
        });
    });

    if (closeOnOutsideClick) {
        document.addEventListener('click', (event) => {
            triggerElements.forEach((triggerElement) => {
                const parentContainer = triggerElement.closest('.modal-time');
                const targetElement = parentContainer?.querySelector(targetSelector);

                if (
                    !triggerElement.contains(event.target) &&
                    targetElement &&
                    !targetElement.contains(event.target)
                ) {
                    triggerElement.classList.remove(className);
                    targetElement.classList.remove(className);
                }
            });
        });
    }
}


toggleTime('.modal-time .icon', '.modal-time__modal', 'is-active', true);


function setupCardToggle(containerSelector, cardSelector, toggleButtonSelector) {
    const container = document.querySelector(containerSelector);

    if (!container) {
        console.error(`Container not found`);
        return;
    }

    container.addEventListener('click', function (event) {
        if (event.target.closest(toggleButtonSelector)) {
            const card = event.target.closest(cardSelector);
            if (card) {
                container.querySelectorAll(`${cardSelector}.active`).forEach(activeCard => {
                    if (activeCard !== card) {
                        activeCard.classList.remove('is-expanded');
                    }
                });

                card.classList.toggle('is-expanded');
            }
        } else {
            container.querySelectorAll(`${cardSelector}.active`).forEach(activeCard => {
                activeCard.classList.remove('is-expanded');
            });
        }
    });
}

setupCardToggle('.mx-main-catalog', '.card-mx', '.card-mx__heading-action');


if (document.querySelector('[data-slider="splide-numbers"]')) {
    let sliderNumbers = new Splide('[data-slider="splide-numbers"]', {
        type: 'slide',
        rewind: true,
        arrows: false,
        pagination: false,
        gap: 12,
        perPage: 1.4,
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
                gap: 20,
                perPage: 2.05,
            },
            991.98: {
                perPage: 2.45,
            },
            1439.98: {
                destroy: true,
            }
        }
    });

    sliderNumbers.mount();
}

if (document.querySelector('[data-slider="splide-services"]')) {
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
}

if (document.querySelector('[data-slider="splide-goods"]')) {
    let sliderGoods = new Splide('[data-slider="splide-goods"]', {
        type: 'slide',
        rewind: true,
        arrows: false,
        pagination: false,
        gap: 12,
        fixedWidth: '156px',
        autoHeight: false,
        // start: 0,
        updateOnMove: true,
        // drag: true,
        // flickPower: 300,
        // snap: true,
        // focus: 'left',
        // easing: 'ease-out',
        // speed: 400,
        mediaQuery: 'min',
        breakpoints: {

            767.98: {
                gap: 16,
                fixedWidth: '200px',
            },
            1439.98: {
                arrows: true,
                perPage: 6,
                perMove: 1,
            },
        }
    });

    sliderGoods.mount();
}

if (document.querySelector('[data-slider="mx-splide-collections"]')) {
    let sliderServicesMX = new Splide('[data-slider="mx-splide-collections"]', {
        destroy: true,
        type: 'slide',
        rewind: true,
        arrows: false,
        pagination: false,
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
            767.98: {
                destroy: false,
                fixedWidth: '632px',
                gap: 16,
            },
            1439.98: {
                destroy: true,
                fixedWidth: '632px',
                gap: 16,
            },
        }
    });

    sliderServicesMX.mount();

    document.querySelectorAll('[data-slider="splide-collections"]').forEach((sliderElement) => {
        let sliderInstance = new Splide(sliderElement, {
            type: 'slide',
            rewind: true,
            arrows: false,
            pagination: false,
            gap: 8,
            fixedWidth: '72px',
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
                767.98: {
                    gap: 12,
                    fixedWidth: '100px',
                },
            }
        });

        sliderInstance.mount();

        sliderElement.addEventListener('pointerenter', () => {
            sliderServicesMX.options = {drag: false};
        });

        sliderElement.addEventListener('pointerleave', () => {
            sliderServicesMX.options = {drag: true};
        });

        sliderElement.addEventListener('touchstart', () => {
            sliderServicesMX.options = {drag: false};
        });

        sliderElement.addEventListener('touchend', () => {
            sliderServicesMX.options = {drag: true};
        });
    });
}


function initializeCounters(selector) {
    const counters = document.querySelectorAll(selector);

    counters.forEach((form) => {
        const decrementButton = form.querySelector('.decrement');
        const incrementButton = form.querySelector('.increment');
        const counterInput = form.querySelector('.counter__input');

        if (!decrementButton || !incrementButton || !counterInput) return;

        const updateCounter = (delta) => {
            const currentValue = parseInt(counterInput.value, 10) || 0;
            const newValue = Math.max(0, currentValue + delta);
            counterInput.value = newValue;
        };

        decrementButton.addEventListener('click', () => updateCounter(-1));

        incrementButton.addEventListener('click', () => updateCounter(1));

        counterInput.addEventListener('input', () => {
            counterInput.value = counterInput.value.replace(/[^0-9]/g, '');
        });

        counterInput.addEventListener('blur', () => {
            if (counterInput.value === '' || parseInt(counterInput.value, 10) < 0) {
                counterInput.value = 0;
            }
        });
    });
}

function initializeCardActions(selector) {
    const cards = document.querySelectorAll(selector);

    cards.forEach((card) => {
        const button = card.querySelector('.btn-blue');

        if (!button) return;

        button.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });
}


if (document.querySelector('.mx-goods')) {
    initializeCounters('.mx-goods__item-content_action form');
    initializeCardActions('.mx-goods__item');
}


// if (document.querySelector('.mx-stories')) {
//     const sliderDemoStories = new Splide('[data-slider="demo-stories"]', {
//         type: 'slide',
//         rewind: true,
//         arrows: false,
//         pagination: false,
//         gap: 12,
//         fixedWidth: '156px',
//         mediaQuery: 'min',
//         breakpoints: {
//             767.98: {
//                 gap: 16,
//                 fixedWidth: '200px',
//             },
//             1439.98: {
//                 arrows: true,
//             },
//         },
//     }).mount();
//
//     const previewSlider = new Splide('[data-slider="preview-stories"]', {
//         type: 'slide',
//         rewind: true,
//         arrows: false,
//         pagination: false,
//         gap: 12,
//         fixedWidth: '180px',
//         drag: false,
//     }).mount();
//
//     const previewStories = document.querySelector('.stories__preview');
//     const stories = document.querySelectorAll('.preview-stories__item');
//     let currentSlide = 0;
//     let currentItem = 0;
//     let autoplayTimer;
//
//     const initProgressBar = () => {
//         const progressBarContainer = stories[currentSlide].querySelector('.progress-bar');
//         const currentSlides = stories[currentSlide].querySelectorAll('.preview-stories__item-slide');
//         const itemsCount = currentSlides.length;
//
//         progressBarContainer.innerHTML = '';
//
//         for (let i = 0; i < itemsCount; i++) {
//             const span = document.createElement('span');
//             span.classList.add('progress-item');
//             progressBarContainer.appendChild(span);
//         }
//
//         progressBarContainer.children[0].classList.add('active');
//     };
//
//     const updateProgressBar = () => {
//         const progressBarContainer = stories[currentSlide].querySelector('.progress-bar');
//         const progressItems = progressBarContainer.querySelectorAll('.progress-item');
//
//         progressItems.forEach(item => item.classList.remove('active'));
//
//         if (progressItems[currentItem]) {
//             progressItems[currentItem].classList.add('active');
//         }
//     };
//
//     const openPopup = (index) => {
//         currentSlide = index;
//         previewStories.classList.add('is-open');
//
//         stories.forEach((story) => {
//             const slides = story.querySelectorAll('.preview-stories__item-slide');
//             slides.forEach((slide) => slide.classList.remove('active'));
//         });
//
//         const currentSlides = stories[currentSlide].querySelectorAll('.preview-stories__item-slide');
//         currentSlides[currentItem].classList.add('active');
//
//         initProgressBar();
//         startAutoplay();
//         previewSlider.go(index);
//     };
//
//     const closePopup = () => {
//         previewStories.classList.remove('is-open');
//
//         stories.forEach((story) => {
//             const slides = story.querySelectorAll('.preview-stories__item-slide');
//             slides.forEach((slide) => slide.classList.remove('active'));
//         });
//
//         clearInterval(autoplayTimer);
//     };
//
//     const nextSlide = () => {
//         const currentSlides = stories[currentSlide].querySelectorAll('.preview-stories__item-slide');
//         const itemsCount = currentSlides.length;
//
//         if (currentItem < itemsCount - 1) {
//             // Переключаем на следующий слайд в preview-stories
//             currentSlides[currentItem].classList.remove('active');
//             currentItem++;
//             currentSlides[currentItem].classList.add('active');
//             updateProgressBar();
//         } else {
//             currentSlides.forEach((slide) => slide.classList.remove('active'));
//             currentItem = 0;
//
//             currentSlide = (currentSlide + 1) % stories.length;
//
//             if (currentSlide === 0) {
//                 closePopup();
//                 return;
//             }
//
//             const nextSlides = stories[currentSlide].querySelectorAll('.preview-stories__item-slide');
//             nextSlides[currentItem].classList.add('active');
//
//             initProgressBar();
//             previewSlider.go(currentSlide);
//         }
//     };
//
//     const prevSlide = () => {
//         const currentSlides = stories[currentSlide].querySelectorAll('.preview-stories__item-slide');
//         const itemsCount = currentSlides.length;
//
//         if (currentItem > 0) {
//             // Переключаем на предыдущий слайд в preview-stories
//             currentSlides[currentItem].classList.remove('active');
//             currentItem--;
//             currentSlides[currentItem].classList.add('active');
//             updateProgressBar();
//         } else {
//             currentSlide = (currentSlide - 1 + stories.length) % stories.length;
//
//             closePopup();
//         }
//     };
//
//     const startAutoplay = () => {
//         const currentSlides = stories[currentSlide].querySelectorAll('.preview-stories__item-slide');
//         const itemsCount = currentSlides.length;
//
//         if (itemsCount === 0) return;
//
//         autoplayTimer = setInterval(() => {
//             nextSlide();
//         }, 10000);
//     };
//
//     document.querySelectorAll('.demo-stories__item').forEach((storyItem) => {
//         storyItem.addEventListener('click', function () {
//             const index = parseInt(storyItem.getAttribute('data-stories'), 10);
//             openPopup(index);
//         });
//     });
//
//     const closeIcon = document.querySelector('.preview-stories__close');
//     if (closeIcon) {
//         closeIcon.addEventListener('click', closePopup);
//     }
//
//     document.addEventListener('click', (event) => {
//         if (!previewStories.contains(event.target) && !event.target.closest('.demo-stories__item')) {
//             closePopup();
//         }
//     });
//
// }


if (document.querySelector('[data-slider="demo-stories"]')) {
    const sliderDemoStories = new Splide('[data-slider="demo-stories"]', {
        type: 'slide',
        rewind: true,
        arrows: false,
        pagination: false,
        gap: 12,
        fixedWidth: '156px',
        mediaQuery: 'min',
        breakpoints: {
            767.98: {
                gap: 16,
                fixedWidth: '200px',
            },
            1439.98: {
                arrows: true,
                perPage: 6,
                perMove: 1,
            },
        },
    })
    sliderDemoStories.mount();

}



function initializeVideoBlocks(videoBlocks) {
    if (videoBlocks.length === 0) return;

    document.addEventListener('DOMContentLoaded', function () {
        videoBlocks.forEach(function (block) {
            let wrappers = document.querySelectorAll(block.wrapperClass);
            if (!wrappers.length) return;

            wrappers.forEach(function (wrapper) {
                let video = wrapper.querySelector(block.controlClass);
                let lightboxLink = wrapper.querySelector('a[data-fslightbox]');

                if (!video || !lightboxLink) return;

                lightboxLink.addEventListener('click', function () {
                    const observer = new MutationObserver(function (mutationsList, observer) {
                        mutationsList.forEach(function (mutation) {
                            if (mutation.type === 'childList') {
                                let lightboxVideo = document.querySelector('.fslightbox-source');
                                if (lightboxVideo) {
                                    lightboxVideo.setAttribute('autoplay', 'true');
                                    lightboxVideo.muted = true;
                                    lightboxVideo.play().catch(error => {
                                        console.error('Autoplay failed:', error);
                                    });
                                    observer.disconnect();
                                }
                            }
                        });
                    });

                    observer.observe(document.body, {childList: true, subtree: true});
                });

                const observer = new MutationObserver(function (mutationsList) {
                    mutationsList.forEach(function (mutation) {
                        let lightboxVideo = document.querySelector('.fslightbox-source');
                        if (!document.querySelector('.fslightbox-container') && lightboxVideo) {
                            lightboxVideo.pause();
                            lightboxVideo.currentTime = 0;
                        }
                    });
                });

                observer.observe(document.body, {childList: true, subtree: true});
            });
        });
    });
}

initializeVideoBlocks([
    {
        wrapperClass: '.demo-stories__item',
        controlClass: '.demo-stories__item video',
    },
]);

