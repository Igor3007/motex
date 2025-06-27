export class Counter {
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