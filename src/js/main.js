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
