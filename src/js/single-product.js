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

    /* ========================================
    counter
    ========================================*/

    let counter, calculator;

    class Counter {
        constructor(params) {
            this.params = params;
            this.container = params.container;
            this.input = this.container.querySelector('.counter__input input');
            this.incBtn = this.container.querySelector('.counter__inc');
            this.decBtn = this.container.querySelector('.counter__dec');

            // Инициализация значения
            this.value = parseInt(this.input.value) || 0;
            this._validateAndUpdate();

            // Инициализация обработчиков событий
            this._initEvents();
        }

        // Инициализация обработчиков событий
        _initEvents() {
            this.incBtn.addEventListener('click', () => this.plus());
            this.decBtn.addEventListener('click', () => this.minus());
            this.input.addEventListener('change', () => this.setValue(this.input.value));
            this.input.addEventListener('input', () => this._handleInput());
        }

        plus() {
            if (this.value < 999) {
                this.value++;
                this._updateDisplay();
            }
            return this.value;
        }

        minus() {
            if (this.value > 0) {
                this.value--;
                this._updateDisplay();
            }
            return this.value;
        }

        setValue(newValue) {
            const num = parseInt(newValue);
            if (!isNaN(num)) {
                this.value = Math.max(0, Math.min(999, num));
                //this._updateDisplay();
                this.input.value = this.value;
            }
            return this.value;
        }

        _updateDisplay() {
            this.input.value = this.value;
            let event = new Event('change')
            event.count = this.value
            this.container.dispatchEvent(event);
        }

        _validateAndUpdate() {
            this.value = Math.max(0, Math.min(999, this.value));
            this._updateDisplay();
        }

        _handleInput() {
            const num = parseInt(this.input.value);
            if (!isNaN(num)) {
                this.value = num;
                this._validateAndUpdate();
            } else if (this.input.value === '') {
                this.value = 0;
            }
        }
    }

    // Инициализация всех счетчиков на странице
    document.querySelectorAll('[data-counter="duplicate"]').forEach(container => {
        counter = new Counter({
            container,
        });



    });

    /* ========================================
    product Calculator
    ========================================*/

    class ProductCalculator {
        constructor(params) {
            this.params = params;
            this.container = params.container;
            this.countInput = this.container.querySelector('input[data-total]');
            this.areaInput = this.container.querySelector('input[data-area]');
            this.volumeInput = this.container.querySelector('input[data-volume]');

            this.initialValues = {
                count: parseFloat(this.countInput.getAttribute('data-total')),
                areaPerItem: parseFloat(this.areaInput.getAttribute('data-area')),
                volumePerItem: parseFloat(this.volumeInput.getAttribute('data-volume'))
            };

            this.init();
        }

        init() {
            this.setupEventListeners();
            this.setupInputValidation();
        }

        // Валидация ввода - только цифры и точка
        setupInputValidation() {
            const validateInput = (e) => {
                // Разрешаем: цифры, точка, Backspace, Delete, Tab, стрелки
                if (!/^[0-9.]$/.test(e.key) &&
                    !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                    e.preventDefault();
                    return false;
                }

                // Запрещаем вводить больше одной точки
                if (e.key === '.' && e.target.value.includes('.')) {
                    e.preventDefault();
                    return false;
                }
            };

            const preventEmpty = (e) => {
                if (e.target.value === '' || e.target.value === '0') {
                    e.target.value = this.getDefaultValue(e.target);
                    this.handleInputChange(e.target);
                }
            };

            this.countInput.addEventListener('keypress', validateInput);
            this.areaInput.addEventListener('keypress', validateInput);
            this.volumeInput.addEventListener('keypress', validateInput);

            this.countInput.addEventListener('blur', preventEmpty);
            this.areaInput.addEventListener('blur', preventEmpty);
            this.volumeInput.addEventListener('blur', preventEmpty);
        }

        getDefaultValue(input) {
            if (input === this.countInput) return '1';
            if (input === this.areaInput) return '0.75';
            if (input === this.volumeInput) return '0.02';
            return '1';
        }

        roundUp(num) {
            return Math.ceil(num);
        }

        updateValues(changedField) {
            let count, area, volume;

            if (changedField === 'count') {
                count = Math.max(1, parseFloat(this.countInput.value) || 1);
                area = count * this.initialValues.areaPerItem;
                volume = count * this.initialValues.volumePerItem;
            }
            else if (changedField === 'area') {
                area = Math.max(0.01, parseFloat(this.areaInput.value) || 0.01);
                count = area / this.initialValues.areaPerItem;
                volume = count * this.initialValues.volumePerItem;
            }
            else if (changedField === 'volume') {
                volume = Math.max(0.01, parseFloat(this.volumeInput.value) || 0.01);
                count = volume / this.initialValues.volumePerItem;
                area = count * this.initialValues.areaPerItem;
            }

            count = this.roundUp(count);

            if (changedField !== 'count') {
                this.countInput.value = count.toFixed(0);
            }
            if (changedField !== 'area') {
                this.areaInput.value = area.toFixed(2);
            }
            if (changedField !== 'volume') {
                this.volumeInput.value = volume.toFixed(2);
            }

            if (this.params.on.changeInputCount) {
                this.params.on.changeInputCount(count)
            }
        }

        setupCounterButtons(input, step) {
            const counter = input.closest('.counter');
            const incBtn = counter.querySelector('.counter__inc');
            const decBtn = counter.querySelector('.counter__dec');

            incBtn.addEventListener('click', () => {
                const currentValue = parseFloat(input.value) || this.getDefaultValue(input);
                input.value = (currentValue + step).toFixed(
                    input === this.countInput ? 0 : 2
                );
                this.handleInputChange(input);
            });

            decBtn.addEventListener('click', () => {
                const currentValue = parseFloat(input.value) || this.getDefaultValue(input);
                const newValue = currentValue - step;
                if (newValue >= step) {
                    input.value = newValue.toFixed(
                        input === this.countInput ? 0 : 2
                    );
                    this.handleInputChange(input);
                }
            });
        }

        handleInputChange(input) {
            // Если поле пустое, устанавливаем минимальное значение
            if (input.value === '' || input.value === '0') {
                input.value = this.getDefaultValue(input);
            }

            if (input === this.countInput) {
                this.updateValues('count');
            }
            else if (input === this.areaInput) {
                this.updateValues('area');
            }
            else if (input === this.volumeInput) {
                this.updateValues('volume');
            }
        }

        setCount(num) {
            this.countInput.value = num;
            this.updateValues('count');
        }

        setupEventListeners() {
            this.countInput.addEventListener('input', () => this.handleInputChange(this.countInput));
            this.areaInput.addEventListener('input', () => this.handleInputChange(this.areaInput));
            this.volumeInput.addEventListener('input', () => this.handleInputChange(this.volumeInput));

            this.setupCounterButtons(this.countInput, 1);
            this.setupCounterButtons(this.areaInput, 0.1);
            this.setupCounterButtons(this.volumeInput, 0.01);
        }
    }

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

    document.querySelector('[data-counter="duplicate"]').addEventListener('change', e => {
        window.calculator.setCount(e.count)
    })


    /* =======================================
    copy-field
    =======================================*/

    document.querySelectorAll('[data-copy]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault()
            let text = (e.target.closest('a')) ? e.target.closest('a').innerText : e.target.dataset.copy
            navigator.clipboard.writeText(text)
                .then(() => {
                    window.STATUS.msg('Скопировано в буфер обмена!')
                })
                .catch(err => {
                    console.log('Something went wrong', err);
                });

        })
    })

    /* ======================================
    scrollNavigation
    ======================================*/

    class ScrollNavigation {
        constructor(options) {
            this.navSelector = options.navSelector;
            this.sectionSelector = options.sectionSelector;
            this.activeClass = options.activeClass || 'active';
            this.offset = options.offset || 100;
            this.navLinks = null;
            this.sections = null;

            this.init();
        }

        init() {
            this.navLinks = document.querySelectorAll(`${this.navSelector} a`);
            this.sections = document.querySelectorAll(this.sectionSelector);

            if (this.navLinks.length && this.sections.length) {
                this.setupClickHandlers();
                this.setupScrollHandler();
                // Проверить активный раздел при загрузке
                this.checkActiveSection();
            }
        }

        setupClickHandlers() {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - this.offset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        setupScrollHandler() {
            window.addEventListener('scroll', () => {
                this.checkActiveSection();
            });
        }

        checkActiveSection() {
            let current = '';
            const scrollPosition = window.pageYOffset;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollPosition >= sectionTop - this.offset) {
                    current = '#' + section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove(this.activeClass);
                if (link.getAttribute('href') === current) {
                    link.classList.add(this.activeClass);
                }
            });
        }
    }

    // Использование

    window.addEventListener('load', () => {
        new ScrollNavigation({
            navSelector: '.sticky-bar-product__nav',
            sectionSelector: '.details-product__group',
            activeClass: 'is-active',
            offset: window.globalConfig.hgtheader + 36
        });
    })


    /* =======================================
    scroll
    =======================================*/

    document.querySelectorAll('[data-scroll]').forEach(item => {
        item.addEventListener('click', (e) => {

            if (document.querySelector(e.target.dataset.scroll)) {
                window.scrollToTargetAdjusted({
                    elem: document.querySelector(e.target.dataset.scroll),
                    offset: window.globalConfig.hgtheader + 36
                })
            }

        })
    })

    /* =======================================
    Tooltip
    =======================================*/

    class TooltipAjax {

        constructor(params) {
            this.$items = document.querySelectorAll(params.el)
            this.tooltip = null;

            this.addEvents()
        }

        LoadTooltip(e, callback) {

            if (e.target.dataset.ajax) {
                this.ajaxLoadHtml(e, (text) => {
                    callback({ text })
                })
            } else if (e.target.dataset.el) {
                if (document.querySelector(e.target.dataset.el)) {
                    callback({
                        text: document.querySelector(e.target.dataset.el).outerHTML
                    })
                }
            } else {
                callback({
                    text: e.target.dataset.tooltip
                })
            }
        }

        ajaxLoadHtml(e, onload) {
            fetch(e.target.dataset.ajax)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка сети');
                    }
                    return response.text();
                })
                .then(text => {
                    onload(text)
                })
                .catch(error => {
                    console.error('Ошибка TooltipAjax:', error);
                });
        }

        getTemplate(data) {
            let html = ` <div class="tooltip-box" ><div class="af-spiner" ></div></div> `;
            if (data) html = `<div class="tooltip-box" >${data.text}</div> `;
            return html;
        }

        positionTooltip(e) {
            const DomRect = e.target.getBoundingClientRect()
            const tooltipW = this.tooltip.clientWidth;
            const tooltipH = this.tooltip.clientHeight;
            const offset = 8;
            const bounds = 20;

            this.tooltip.style.left = (DomRect.x - (tooltipW / 2) + (bounds / 2)) + 'px'
            this.tooltip.style.top = (DomRect.y - tooltipH - (bounds / 2)) - offset + 'px'


            if (this.tooltip.getBoundingClientRect().left < bounds) {
                this.tooltip.classList.add('tooltip-box-item--left')
                this.tooltip.style.left = (DomRect.x - (DomRect.x / 2) + (bounds / 2)) + offset + 'px'
            }

            if (this.tooltip.getBoundingClientRect().top < bounds) {
                this.tooltip.classList.add('tooltip-box-item--top')
                this.tooltip.style.top = (DomRect.y + (bounds)) + offset + 'px'
            }
        }

        tooltipDesctop(e) {

            this.tooltipRemove()
            this.tooltip = document.createElement('div')
            this.tooltip.innerHTML = this.getTemplate(false)
            this.tooltip.classList.add('tooltip-box-item')

            document.body.append(this.tooltip)
            this.positionTooltip(e)

            //load data

            this.LoadTooltip(e, (response) => {
                this.tooltip.innerHTML = this.getTemplate(response)
                this.positionTooltip(e)
            })
        }

        tooltipPopup(e) {
            const tooltipPopup = new afLightbox({
                mobileInBottom: true
            })

            tooltipPopup.open(`<div class="popup-tooltip-box" >${this.getTemplate(false)}</div>`, () => {
                this.LoadTooltip(e, (response) => {
                    let html = `<div class="popup-tooltip-box" >${this.getTemplate(response)}</div>`
                    tooltipPopup.changeContent(html)
                })
            })
        }

        tooltipRemove() {
            !this.tooltip || this.tooltip.remove()
        }

        addEvents() {
            this.$items.forEach(item => {

                //for desctop
                if (document.body.clientWidth > 576) {

                    item.addEventListener('mouseenter', e => {
                        this.tooltipDesctop(e)

                        //add event close on scroll
                        window.addEventListener('scroll', e => {
                            this.tooltipRemove()
                        })

                    })

                    //add event close on outher click 
                    item.addEventListener('mouseleave', e => {
                        //this.tooltipRemove()
                    })

                } else {
                    item.addEventListener('click', e => {
                        //for mobile
                        this.tooltipPopup(e)
                    })
                }



            })
        }

    }

    new TooltipAjax({
        el: '[data-tooltip]'
    })

});

