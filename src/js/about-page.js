if (document.querySelector('.about-company__slider.splide')) {
    const splide_about = new Splide('.about-company__slider.splide', {
        trimSpace: false,
        focus: 'center',
        perPage: 3,
        updateOnMove: true,
        arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
        pagination: false,
        breakpoints: {
            767: {
                perPage: 1,
                gap: "12px"
            }
        }
    });

    const timeline_el = document.querySelector('.about-company__timeline.splide');

    if (timeline_el) {
      const splide_timeline = new Splide(timeline_el, {
        trimSpace: false,
        focus: 'center',
        perPage: 3,
        updateOnMove: true,
        arrows: false,
        pagination: false,
        breakpoints: {
          767: {
            perPage: 1,
          }
        }
      });

      splide_about.sync(splide_timeline);
      splide_timeline.mount();
    }

  splide_about.mount();


    if (window) {
        window.onresize = () => {
            splide_about.refresh();
        }
    }
}
