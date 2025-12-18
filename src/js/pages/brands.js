import Splide from "@splidejs/splide";

(function(){
  if (!document.querySelector('.splide.brands__popular')) return;

  const splide = new Splide('.splide.brands__popular', {
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
