import Splide from "@splidejs/splide";

(function(){
  const selector = '.splide.brands__popular';
  if (!document.querySelector(selector)) return;

  const splide = new Splide(selector, {
    arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
    type: "loop",
    pagination: false,
    perPage: 4,
    perMove: 1,
    gap: 16,
    breakpoints: {
      1024: {
        perPage: 3
      },
      767: {
        perPage: 2,
        arrows: false
      }
    }
  });
  splide.mount();
}());

(function(){
  const selector = '.splide.brand__slider';
  if (!document.querySelector(selector)) return;

  const splide = new Splide(selector, {
    arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
    type: "loop",
    pagination: false,
    perPage: 1,
    perMove: 1
  });
  splide.mount();
}());

(function(){
  const selector = '.splide.brand__slider-cat';
  if (!document.querySelector(selector)) return;

  const splide = new Splide(selector, {
    arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
    pagination: false,
    perPage: 6,
    perMove: 1,
    gap: 16,
    breakpoints: {
      1024: {
        perPage: 3
      },
      767: {
        perPage: 2,
        gap: 12,
        arrows: false
      }
    }
  });
  splide.mount();
}());
