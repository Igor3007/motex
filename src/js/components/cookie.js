export class PersonalDataPopup {
  constructor() {
    this.popup = document.querySelector('.bottom-popup');
    this.cookieName = 'personalData';
    this.cookieExpires = 7; // дней

    this.init();
  }

  init() {
    // Проверяем, есть ли куки
    if (!this.getCookie(this.cookieName)) {
      this.openPopup();
    }

    // Добавляем обработчик события на кнопку
    const button = this.popup ? this.popup.querySelector('.btn-blue') : null
    if (button) {
      button.addEventListener('click', () => this.handleButtonClick());
    }
  }

  openPopup() {
    if (this.popup) {
      this.popup.classList.add('open');
    }
  }

  closePopup() {
    if (this.popup) {
      this.popup.classList.remove('open');
    }
  }

  handleButtonClick() {
    this.setCookie(this.cookieName, 'true', this.cookieExpires);
    this.closePopup();
  }

  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

}
