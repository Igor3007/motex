export class FormHelper {
    constructor(params) {

        this.forms = params.el.querySelectorAll('[data-form]');
        this.params = params
        this.init();
    }

    init() {

        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm(form)) {
                    this.formSubmitAjax(form)
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        const emailFields = form.querySelectorAll('input[type="email"]');

        // Сброс предыдущих ошибок
        this.resetErrors(form);

        // Проверка обязательных полей
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.markFieldAsInvalid(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });

        // Проверка email полей
        emailFields.forEach(field => {
            if (field.value.trim() && !this.validateEmail(field.value)) {
                this.markFieldAsInvalid(field, 'Введите корректный email');
                isValid = false;
            }
        });

        if (!isValid) {
            window.STATUS.err('Пожалуйста, исправьте ошибки в форме');
        }

        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    markFieldAsInvalid(field, message) {
        field.style.borderColor = 'red';
        // Создаем элемент для сообщения об ошибке
        const errorElement = document.createElement('div');
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '12px';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    resetErrors(form) {
        // Убираем красную подсветку
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
        });

        // Удаляем предыдущие сообщения об ошибках
        form.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    formSubmitAjax(form) {

        window.STATUS.msg('Ваше сообщение отправлено!')
        form.reset()

        if (typeof this.params.onSubmit != 'undefined') {
            this.params.onSubmit(form)
        }

    }
} 