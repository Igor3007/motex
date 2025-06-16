const splide_about = new Splide( '.about-company__slider.splide', {
    trimSpace: false,
    focus    : 'center',
    perPage  : 3,
    updateOnMove: true,
    arrowPath: 'm24.381 3.9208-3.0832 3.0417 10.292 10.292h-31.292v4.3333h31.292l-10.292 10.292 3.0832 3.0416 15.5-15.5z',
    pagination: false,
    breakpoints: {
        767: {
            perPage: 1,
            gap: "12px"
        }
    }
} ).mount();

if (window) {
    window.onresize = () => {
        splide_about.refresh();
    }
}

const timeline = document.getElementById('slider-timeline');

splide_about.on('mounted move', function(newIndex) {
    timeline.style.backgroundPositionX = `${-newIndex*200}px`;
});