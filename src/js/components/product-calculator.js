export class ProductCalculator {
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