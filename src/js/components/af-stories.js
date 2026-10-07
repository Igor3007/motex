import Splide from "@splidejs/splide";


class AfLayoutImage {
  constructor(params) {
    this.$el = document.createElement('div')
    this.data = params
    this.progressBar = null
  }

  init() {
    this.$el.innerHTML = this.getTemplateLayout()
    this.$el.classList.add('af-stories-slide')

    if(!this.data.slideIndex) {
      this.$el.classList.add('is-active')
    }
  }

  getTemplateLayout() {
    return `
          <div class="af-stories-slide__container" >
            <div class="af-stories-slide__picture" >
              <pictuire>
                <img src="${this.data.url}" >
              </pictuire>
            </div>
            <div class="af-stories-slide__footer" >
              <div class="af-stories-slide__desc" >${this.data.desc}</div>
            </div>
          </div>`
  }



  node() {
    this.init()
    return this.$el
  }
}
class AfLayoutVideo {
  constructor(params) {
    this.$el = document.createElement('div')
    this.data = params
    this.progressBar = null
  }

  init() {
    this.$el.innerHTML = this.getTemplateLayout()
    this.$el.classList.add('af-stories-slide')

    if(!this.data.slideIndex) {
      this.$el.classList.add('is-active')
    }
  }

  getTemplateLayout() {
    return `
          <div class="af-stories-slide__container" >
            <div class="af-stories-slide__video" >
              <video src="${this.data.url}" ></video>
            </div>
            <div class="af-stories-slide__footer" >
              <div class="af-stories-slide__desc" >${this.data.desc}</div>
              <div class="af-stories-slide__control" >
                <div class="af-stories-video__play" >p</div>
                <div class="af-stories-video__progress" ><span class="bar" ></span></div>
                <div class="af-stories-video__mute" >m</div>
              </div>
            </div>
          </div>
       `
  }

  node() {
    this.init()
    return this.$el
  }
}




class AfLayoutSlide {
  constructor (params) {
    this.data = params.data;
    this.$slide = document.createElement('div')
    this.$el = document.createElement('div')
    this.progressBar = null
    this.init()
  }

  init() {
    this.$el.innerHTML = this.getTemplate()
    this.$el.classList.add('splide__slide')
    this.create(this.data)
  }

  create (element) {

      this.$slide.classList.add('ssww')

      element.stories.forEach((data, index) => {
        switch(data.type) {

          case 'image':
            this.$slide.append(new AfLayoutImage({
              ...data,
              slideIndex: index
            }).node());
          break;

          case 'video':
            this.$slide.append(new AfLayoutVideo({
              ...data,
              slideIndex: index
            }).node());
          break;
        }

        this.$el.querySelector('[data-slides]').append(this.$slide)

      });
  }

   getProgressBar() {
    this.progressBar = this.data.stories.reduce((acc, item, i)=>{
      return acc += '<li><span class="bar"></span></li>'
    }, '')
    return this.progressBar;
  }

  getTemplate() {

    return `<div class="af-stories-box" >
      <div class="af-stories-box__progress" ><ul>${this.getProgressBar()}</ul></div>
      <div class="af-stories-box__user" >
        <div class="af-stories-box__logo" >
          <img src="${this.data.creator.logo}" >
        </div>
        <div class="af-stories-box__name" >${this.data.creator.name}</div>
      </div>
      <div class="af-stories-box__slides" data-slides ></div>
    </div>`
  }

  getHtml() {
    return this.$el
  }
}

export class AfStories {
  constructor() {
    this.$el = document.querySelector('.af-stories')
    this.modal = null;
    this.sliderPopup = null;
    this.slides = [];
    this.init()
  }

  init() {
    this.initSliderSelect()
    this.addEvents()
  }

  initSliderSelect() {
    new Splide('[data-slider="af-stories-select"]', {
      perPage: 1,          // количество слайдов на странице
      perMove: 1,          // листать по одному
      fixedWidth: '80px',  // фиксированная ширина слайда
      gap: '8px',          // отступ между слайдами (можешь убрать/поменять)
      drag: 'free',        // свободное перетаскивание (free drag)
      snap: false,         // без прилипания — нужно для free drag
      arrows: false,       // можешь включить true, если нужны стрелки
      pagination: false,
      flickPower: 300,     // сила "флика" — подкрути под вкус
      flickMaxPages: 1,    // ограничить инерцию
      gap: 24
    }).mount();
  }

  createStoriesSlides() {
    const arr = [
      {
        creator: {
          logo: '/images/icons/ic_logo-min.svg',
          name: 'Mottex corporation',
        },
        stories: [

          {
            type: 'video',
            duration: null,
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'image',
            url: '/images/stories/i_stories-a002.jpg',
            duration: '20000',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },

        ]
      },
      {
        creator: {
          logo: '/images/icons/ic_logo-min.svg',
          name: 'Mottex corporation',
        },
        stories: [
          {
            type: 'image',
            duration: null,
            url: '/images/stories/i_stories-a003.jpg',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            duration: null,
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            duration: null,
            url: '/dist/static/mottex.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
        ]
      },
      {
        creator: {
          logo: '/images/icons/ic_logo-min.svg',
          name: 'Mottex corporation',
        },
        stories: [
          {
            type: 'image',
            duration: null,
            url: '/images/stories/i_stories-a004.jpg',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            duration: null,
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
        ]
      },
      {
        creator: {
          logo: '/images/icons/ic_logo-min.svg',
          name: 'Mottex corporation',
        },
        stories: [
          {
            type: 'image',
            duration: null,
            url: '/images/stories/i_stories-a001.jpg',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            duration: null,
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
        ]
      },


    ];

    arr.forEach((element, i) => {

      this.slides[i] = new AfLayoutSlide({
        data: element
      })

      this.modal.querySelector('.splide__list').append(this.slides[i].getHtml())

    });
  }

  getStoriesSlider() {
    return `
      <div class="splide" >
        <div class="splide__track">
          <div class="splide__list"></div>
        </div>
      </div>
    `;
  }

  getTemplateModal() {
    return `
      <div class="af-series-container" >
        <div class="af-series-overlay">
          <div class="af-series-content">${this.getStoriesSlider()}</div>
        </div>
      </div>
    `;
  }

  initSliderPopup() {

    let spl = this.modal.querySelector('.splide')

    new Splide(spl, {
      perPage: 1,
      perMove: 1,
      arrows: false,
      pagination: false,
      gap: 24,
      fixedHeight: '92vh',
      fixedWidth: 'calc(92vh * 50 / 89)',
      focus  : 'center',
      padding: { left: '25%', right: '25%' }, // подгони под свою ширину слайда
      noDrag: '.splide__slide',
      isNavigation: true, // делает слайды кликабельны
      updateOnMove:true

    }).mount();
  }

  openModal() {
    this.modal = document.createElement('div')
    this.modal.innerHTML = this.getTemplateModal()
    this.createStoriesSlides(this.modal)
    this.initSliderPopup()
    document.body.append(this.modal)

    // setTimeout(()=> {
    //   this.initSliderPopup()
    // }, 1000)
  }

  closeModal() {
    this.modal.remove();
  }


  addEvents() {
    this.$el.querySelectorAll('.af-stories-item').forEach(item => {
      item.addEventListener('click', () => {
        this.openModal()
      })
    })
  }




}
