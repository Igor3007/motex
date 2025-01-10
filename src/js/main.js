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
