import {pluralForm} from "../../helpers/plural-form.js";
import Splide from "@splidejs/splide";

const initTimer = () => {
  const timeEl = document.getElementById("cta-time");
  const slots = {
    days: document.querySelector("#cta-days"),
    timer: document.querySelector("#cta-timer"),
  };
  if (!timeEl || !slots.days || !slots.timer) {
    return;
  }

  const {deadline} = timeEl.dataset || '0/0/0';
  const [d, m, Y] =deadline.split('/');
  const timeTo = new Date(+Y, +m-1, +d);

  const getDHMS = (time) => {
    const secondsFull = Math.floor(time / 1000);
    const minutesFull = Math.floor(secondsFull / 60);
    const seconds = secondsFull - minutesFull * 60;
    const hoursFull = Math.floor(minutesFull / 60);
    const minutes = minutesFull - hoursFull * 60;
    const days = Math.floor(hoursFull / 24);
    const hours = hoursFull - days * 24;
    return {days, hours, minutes, seconds}
  }

  const placeDHMS = (DHMS) => {
    const {days, hours, minutes, seconds} = DHMS;
    slots.days.innerHTML = `${days.toString()} ${pluralForm(days,['день', 'дня', 'дней'])}`;
    slots.timer.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const now = Date.now();

  placeDHMS(getDHMS(timeTo - now));

  const timer = setInterval(() => {
    const timeNow = Date.now();
    const restTime = timeTo - timeNow;

    if (restTime <= 0) {
      clearInterval(timer);
      return;
    }

    placeDHMS(getDHMS(restTime));

  }, 1000);
};

const initSlider = () => {
  document
    .querySelectorAll('[data-slider="discounts"]')
    .forEach((el) => {
      let slider = new Splide(el, {
        type: 'slide',
        arrows: false,
        arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
        fixedWidth: '240px',
        gap: 12,
        pagination: false,
        drag: true,
        mediaQuery: 'min',
        breakpoints: {}
      });
      slider.mount();
    });
};

document.addEventListener("DOMContentLoaded", () => {
  initTimer();
  initSlider();
});
