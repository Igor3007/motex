document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
    css variable
    =================================================*/

    function css_variable() {
        let vh = window.innerHeight * 0.01;
        let hgtheader = document.querySelector('.header') ? document.querySelector('.header').clientHeight : 64

        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.setProperty('--hgt-header', hgtheader + 'px');

        window.globalConfig = {
            vh,
            hgtheader
        }
    }

    

    window.addEventListener('load', css_variable)
    window.addEventListener('resize', css_variable)

    /* =================================================
    smooth scroll
    ================================================= */

    window.scrollToTargetAdjusted = function (params) {

        let element = typeof params.elem == 'string' ? document.querySelector(params.elem) : params.elem
        let elementPosition = element.getBoundingClientRect().top + window.scrollY

        let offsetPosition = elementPosition
        offsetPosition -= (params.offset ? params.offset : 0)

        window.scrollTo({
            top: Number(offsetPosition),
            behavior: "smooth"
        });
    }

    /* =========================================
    Time toggle tooltip
    =========================================*/

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
                    const targetElement = parentContainer ? parentContainer.querySelector(targetSelector) : null;

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


    toggleTime('.modal-time__action', '.modal-time__modal', 'is-active', true);
    toggleTime('.top-header__time', '.modal-time__modal', 'is-active', true);

    /* =========================================
    Time toggle card
    =========================================*/

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

    /* =========================================
    Splide numbers
    =========================================*/

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

    /* =========================================
    Splide services
    =========================================*/

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

    /* =========================================
    Splide simple-collections
    =========================================*/

    if (document.querySelector('[data-slider="splide-simple-collections"]')) {
        let sliderSimpleCollections = new Splide('[data-slider="splide-simple-collections"]', {
            type: 'slide',
            rewind: true,
            arrows: false,
            pagination: false,
            gap: 12,
            fixedWidth: '324px',
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
                    fixedWidth: '632px',
                },
                1439.98: {
                    destroy: true,
                }
            }
        });

        sliderSimpleCollections.mount();
    }

    /* =========================================
    Splide top products
    =========================================*/

    if (document.querySelector('[data-slider="splide-goods"]')) {
        let sliderGoods = new Splide('[data-slider="splide-goods"]', {
            type: 'slide',
            rewind: true,
            arrows: false,
            pagination: false,
            gap: 12,
            fixedWidth: '156px',
            autoHeight: false,
            updateOnMove: true,
            mediaQuery: 'min',
            breakpoints: {

                767.98: {
                    gap: 16,
                    fixedWidth: '200px',
                    arrows: true,
                },
                1439.98: {
                    
                    perPage: 6,
                    perMove: 1,
                },
            }
        });

        sliderGoods.mount();
    }

    /* =========================================
    Splide collections
    =========================================*/

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
                sliderServicesMX.options = {
                    drag: false
                };
            });

            sliderElement.addEventListener('pointerleave', () => {
                sliderServicesMX.options = {
                    drag: true
                };
            });

            sliderElement.addEventListener('touchstart', () => {
                sliderServicesMX.options = {
                    drag: false
                };
            });

            sliderElement.addEventListener('touchend', () => {
                sliderServicesMX.options = {
                    drag: true
                };
            });
        });
    }

    /* =========================================
    Splide stories
    =========================================*/

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

    /* =========================================
    Minicard counter
    =========================================*/

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


    if (document.querySelector('.main-goods-item')) {
        initializeCounters('.main-goods-item__item-content_action form');
        initializeCardActions('.main-goods-item');
    }


    /* =========================================
    VideoBlock
    =========================================*/


    function initializeVideoBlocks(videoBlocks) {
        if (videoBlocks.length === 0) return;


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

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
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

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        });

    }

    initializeVideoBlocks([{
        wrapperClass: '.demo-stories__item',
        controlClass: '.demo-stories__item video',
    },]);

    /* =========================================
    email validator
    =========================================*/

    class EmailFormValidator {
        constructor(selector) {
            this.forms = document.querySelectorAll(selector);
            this.init();
        }

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        activateForm(form, button) {
            button.classList.remove("btn-disabled");
            button.removeAttribute("disabled");
            form.classList.add("is--send");
        }

        deactivateForm(form, button) {
            button.classList.add("btn-disabled");
            button.setAttribute("disabled", "disabled");
            form.classList.remove("is--send");
        }

        handleInput(event) {
            const input = event.target;
            const form = input.closest("form");
            const submitButton = form.querySelector("button");
            const email = input.value.trim();

            if (this.isValidEmail(email)) {
                this.activateForm(form, submitButton);
            } else {
                this.deactivateForm(form, submitButton);
            }
        }

        init() {
            this.forms.forEach((form) => {
                const input = form.querySelector("input[type='text']");
                if (input) {
                    input.addEventListener("input", (event) => this.handleInput(event));
                }
            });
        }
    }

    new EmailFormValidator(".info-footer__sales form");


    /* =========================================
    action panel
    =========================================*/

    function setupActionPanel(panelSelector, activeClass) {
        const panel = document.querySelector(panelSelector);

        if (!panel) return;

        const buttons = panel.querySelectorAll(".config-action__btn");
        const windows = document.querySelectorAll(".header__menu, .section-top-catalog, .cart-header__modal");

        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();

                const targetKey = button.dataset.target;
                const targetWindow = targetKey ?
                    document.querySelector(`[data-window="${targetKey}"]`) :
                    null;

                const isActive = button.classList.contains(activeClass);

                windows.forEach((win) => win.classList.remove(activeClass));
                buttons.forEach((btn) => btn.classList.remove(activeClass));

                if (isActive) {
                    button.classList.remove(activeClass);
                    document.body.classList.remove('page-hidden')

                    setTimeout(() => {
                        if (window.TopCatalog && window.TopCatalog.vueApp && window.TopCatalog.vueApp.isOpen) {
                            window.TopCatalog.vueApp.closePopup();
                        }
                    }, 100)


                } else {
                    button.classList.add(activeClass);
                    document.body.classList.add('page-hidden')
                    targetWindow ? targetWindow.classList.add(activeClass) : null;

                    if (window.TopCatalog && window.TopCatalog.vueApp && window.TopCatalog.vueApp.isOpen) {
                        window.TopCatalog.vueApp.closePopup();
                    }

                    if (button.classList.contains('config-catalog')) {
                        if (window.TopCatalog) {
                            window.TopCatalog.vueApp.isOpen = true;
                            window.TopCatalog.vueApp.openPopup();
                        }
                    }
                }
            });
        });

        // document.addEventListener("click", () => {
        //     buttons.forEach((btn) => btn.classList.remove(activeClass));
        //     windows.forEach((win) => win.classList.remove(activeClass));
        // }); 

        windows.forEach((win) => {
            win.addEventListener("click", (event) => {
                event.stopPropagation();
            });

            const closeButton = win.querySelector(".heading-menu__close");
            if (closeButton) {
                closeButton.addEventListener("click", (event) => {
                    document.body.classList.toggle('page-hidden', false)
                    event.stopPropagation();
                    win.classList.remove(activeClass);
                    buttons.forEach((btn) => btn.classList.remove(activeClass));

                    if (window.TopCatalog && window.TopCatalog.vueApp && window.TopCatalog.vueApp.isOpen) {
                        window.TopCatalog.vueApp.closePopup();
                    }
                });
            }
        });
    }


    setupActionPanel(".action-panel", "is-active");


    /* =========================================
    Popup question
    =========================================*/

    document.querySelectorAll('.get-modal--call').forEach(item => {
        item.addEventListener('click', (e) => {
            let popup = new afLightbox({
                mobileInBottom: true,
                beforeClose: () => {

                    let warn = new afLightbox({
                        mobileInBottom: true,
                    })

                    let html = `<div class="warn-modal">
                                <div class="warn-modal__heading"><h2>Закрыть окно?</h2></div>
                                <div class="warn-modal__info">
                                    <div class="warn-modal__info-text">
                                        <p>Вопрос не сохранится, <br> если вы закроете окно</p>
                                    </div>
                                    <div class="warn-modal__info-actions">
                                        <button class="btn-blue">Закрыть</button>
                                        <button class="btn-custom">Остаться</button>
                                    </div>
                                </div>
                            </div>`

                    warn.open(html, (content) => {
                        content.querySelector('.btn-blue').addEventListener('click', () => {
                            warn.close()
                            popup.close(true)
                        })
                        content.querySelector('.btn-custom').addEventListener('click', () => {
                            warn.close()
                        })
                    })

                    return true
                }
            })

            popup.open('<div class="af-loading" ></div>', (instance) => {
                let query = fetch('/pages/_popup-question.html', {
                    method: 'GET',
                })

                query
                    .then((response => response.text()))
                    .then((html) => {
                        popup.changeContent(html)
                    })
            })
        })
    })

    /* ====================================
    play video on hover
    ====================================*/

    document.querySelectorAll('.demo-stories__item').forEach(thumbnail => {
        const video = thumbnail.querySelector('video');

        let timeout;
        let timerOnHover;

        thumbnail.addEventListener('mouseenter', () => {

            video.src = video.dataset.src

            timeout = setTimeout(() => {
                video.pause();
            }, 5000);

            timerOnHover = setTimeout(() => {
                video.play();
            }, 500);
        });

        thumbnail.addEventListener('mouseleave', () => {
            clearTimeout(timerOnHover);
            clearTimeout(timeout);
            video.pause();
            video.src = video.src;
            video.currentTime = 0;
        });

        thumbnail.addEventListener('click', (e) => {
            e.preventDefault()
            const lightbox = new FsLightbox();
            lightbox.props.sources.push(video.src);

            lightbox.props.onOpen = function () {
                lightbox.elements.container.querySelector('video').play()
            }

            lightbox.open();
        })
    })

}); //DCL


if (document.querySelector('.mx-simple-collections')) {
    document.querySelectorAll('.splide__slide').forEach((slide) => {
        slide.addEventListener('mouseenter', () => {
            document.querySelectorAll('.splide__slide').forEach((el) => {
                el.classList.add('is--hover');
            });
            slide.classList.add('is--active');
        });

        slide.addEventListener('mouseleave', () => {
            document.querySelectorAll('.splide__slide').forEach((el) => {
                el.classList.remove('is--hover', 'is--active');
            });
        });
    });

}


if (document.querySelector('.dropdown')) {
    document.addEventListener("DOMContentLoaded", function () {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector('.dropdown__toggle');
            const toggleText = toggle.querySelector('span');
            const menu = dropdown.querySelector('.dropdown__menu');
            const items = menu.querySelectorAll('.dropdown__item');

            function setActiveItem(selectedText) {
                items.forEach((item) => {
                    item.classList.toggle('is-active', item.textContent.trim() === selectedText.trim());
                });
            }

            setActiveItem(toggleText.textContent);

            toggle.addEventListener('click', (event) => {
                event.stopPropagation();
                const isOpen = dropdown.classList.contains('is-open');

                dropdowns.forEach((d) => d.classList.remove('is-open'));

                dropdown.classList.toggle('is-open', !isOpen);
            });

            document.addEventListener('click', (event) => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('is-open');
                }
            });

            items.forEach((item) => {
                item.addEventListener('click', () => {
                    toggleText.textContent = item.textContent;
                    setActiveItem(item.textContent);
                    dropdown.classList.remove('is-open');
                });
            });
        });
    });
}


if (document.querySelector('.mx-bd-catalog')) {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.mx-bd-catalog__catalog-list');
        const buttons = document.querySelectorAll('.catalog-views__btn');

        const setView = (view) => {
            container.classList.toggle('grid--view', view === 'grid');
            container.classList.toggle('list--view', view === 'list');

            buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));

            localStorage.setItem('viewMode', view);
        };

        const savedView = localStorage.getItem('viewMode') || 'grid';
        setView(savedView);

        buttons.forEach(button => {
            button.addEventListener('click', () => setView(button.dataset.view));
        });
    });
}

if (document.querySelector('.mx-bd-catalog__aside-dropdown')) {
    document.addEventListener("DOMContentLoaded", function () {
        const dropdownItems = document.querySelectorAll('.mx-bd-catalog__aside-dropdown-list .item');

        dropdownItems.forEach(item => {
            const arrow = item.querySelector('span');

            if (!arrow) return;

            arrow.addEventListener('click', function (event) {
                event.stopPropagation();

                const parentLi = item.closest('li');
                const submenu = parentLi.querySelector('ul');

                if (!submenu) return;

                const isOpen = parentLi.classList.contains("is-open");

                document.querySelectorAll('.mx-bd-catalog__aside-dropdown-list li.is-open').forEach(openItem => {
                    if (openItem !== parentLi) {
                        openItem.classList.remove('is-open');
                    }
                });

                parentLi.classList.toggle('is-open', !isOpen);
            });
        });

        document.addEventListener('click', function (event) {
            if (!event.target.closest('.mx-bd-catalog__aside-dropdown-list')) {
                document.querySelectorAll('.mx-bd-catalog__aside-dropdown-list li.is-open').forEach(openItem => {
                    openItem.classList.remove('is-open');
                });
            }
        });
    });
}


if (document.querySelector('.filter-properties__head')) {
    const items = document.querySelectorAll('.filter-properties__head')

    items.forEach(item => {
        item.addEventListener('click', e => {
            item.closest('.filter-properties').classList.toggle('is-hide')
        })
    })
}


if (document.querySelector('.filter-properties')) {
    document.addEventListener("DOMContentLoaded", function () {
        const container = document.querySelector('.category-filter');
        if (container) {
            const subMenus = container.querySelectorAll('.filter-properties__list ul');

            subMenus.forEach(ul => {
                const items = ul.querySelectorAll('li');

                if (items.length > 5) {
                    items.forEach((item, index) => {
                        if (index >= 5) item.classList.add('hidden');
                    });

                    const hiddenCount = items.length - 5;
                    const toggleBtn = document.createElement('div');
                    toggleBtn.classList.add('sub-menu-toggle');
                    toggleBtn.innerHTML = `Ещё <span>${hiddenCount}</span> <i class="icon"></i>`;

                    toggleBtn.addEventListener('click', () => {
                        ul.classList.toggle('is-open');
                        toggleBtn.classList.toggle('is-open');

                        const isOpen = ul.classList.contains('is-open');

                        items.forEach((item, index) => {
                            if (index >= 5) {
                                item.classList.toggle('hidden', !isOpen);
                            }
                        });

                        if (isOpen) {
                            toggleBtn.innerHTML = `Свернуть <i class="icon"></i>`;
                        } else {
                            toggleBtn.innerHTML = `Ещё <span>${hiddenCount}</span> <i class="icon"></i>`;
                        }
                    });

                    ul.after(toggleBtn);
                }
            });
        }
    });
}

if (document.querySelector('.category-filter')) {
    document.addEventListener('DOMContentLoaded', () => {
        let newRangeSlider = null;

        const initPriceRange = () => {
            const slider = document.getElementById('price-slider');
            if (!slider) {
                console.error('Слайдер не найден');
                return;
            }

            if (newRangeSlider) {
                newRangeSlider = null;
            }

            newRangeSlider = new ZBRangeSlider('price-slider');

            const inputMax = document.querySelector('[data-price-range="max"]');
            const inputMin = document.querySelector('[data-price-range="min"]');

            const priceMax = slider.getAttribute('se-max') || 10000;
            const priceMin = slider.getAttribute('se-min') || 0;

            const form = inputMax.closest('form');
            const entity = form?.dataset.filter;

            newRangeSlider.didChanged = (min, max) => {
                inputMax.value = max;
                inputMin.value = min;

                if (entity && window.Filter?.[entity]) {
                    window.Filter[entity].submit();
                }
            };

            inputMax.addEventListener('keyup', (e) => {
                let int = e.target.value.replace(/\D/g, '');
                int = Math.min(Number(int), Number(priceMax));
                e.target.value = int;
                newRangeSlider.setMaxValue(int);
            });

            inputMin.addEventListener('keyup', (e) => {
                let int = e.target.value.replace(/\D/g, '');
                int = Math.max(Number(int), Number(priceMin));
                e.target.value = int;
                newRangeSlider.setMinValue(int);
            });
        };

        const filterTrigger = document.querySelector('[data-filter-trigger="filter"]');
        const filterContainer = document.querySelector('[data-filter-container="filter"]');
        const closeButton = document.querySelector('[data-filter-close="close"]');

        if (document.querySelector('.filter-properties__range')) {
            initPriceRange();
        }

        if (filterTrigger && filterContainer && closeButton) {
            filterTrigger.addEventListener('click', () => {
                filterContainer.classList.add('fixed');
                document.body.classList.add('page-hidden');
                setTimeout(initPriceRange, 100);
            });

            closeButton.addEventListener('click', () => {
                filterContainer.classList.remove('fixed');
                document.body.classList.remove('page-hidden');
            });
        }

        window.addEventListener('resize', () => {
            setTimeout(initPriceRange, 200);
        });

        const clearButton = document.querySelector('[data-filter="clear"]');

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                document.querySelectorAll('.category-filter__item input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });

                if (newRangeSlider) {
                    const priceMin = document.getElementById('price-slider').getAttribute('se-min') || 0;
                    const priceMax = document.getElementById('price-slider').getAttribute('se-max') || 10000;
                    newRangeSlider.setMinValue(priceMin);
                    newRangeSlider.setMaxValue(priceMax);
                    document.querySelector('[data-price-range="min"]').value = priceMin;
                    document.querySelector('[data-price-range="max"]').value = priceMax;
                }

                const form = document.querySelector('.category-filter__item form');
                const entity = form?.dataset.filter;
                if (entity && window.Filter?.[entity]) {
                    window.Filter[entity].submit();
                }
            });
        }
    });
}


