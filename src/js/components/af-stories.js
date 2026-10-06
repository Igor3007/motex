import Splide from "@splidejs/splide";


class AfLayoutImage {
  constructor(params) {
    this.$el = document.createElement('div')
    this.data = params
    this.progressBar = null
  }

  getTemplateLayout() {
    return `
      <div class="splide__slide" >
        <div class="af-stories-image" >
          <div class="af-stories-image__progress" >
            <ul>${this.getProgressBar()}</ul>
          </div>
        </div>
      </div>`
  }

  // getProgressBar() {
  //   this.progressBar = this.data.stories.reduce((acc, item, i)=>{
  //     return acc += '<li>'+i+'</li>'
  //   }, '')
  //   return this.progressBar;
  // }

  node() {
    this.$el.innerHTML = this.getTemplateLayout()
    return this.$el
  }
}

class AfLayoutVideo {
  constructor(params) {
    this.$el = document.createElement('div')
  }

  node() {
    this.$el.innerHTML = 'layot video'

    return this.$el
  }
}

export class AfStories {
  constructor() {
    this.$el = document.querySelector('.af-stories')
    this.modal = null;
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
          logo: '/images/icons/ic_logo-mtx.svg',
          name: 'Mottex corporation',
        },
        stories: [
          {
            type: 'image',
            url: '/images/stories/i_stories-a002.jpg',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
        ]
      },
      {
        creator: {
          logo: '/images/icons/ic_logo-mtx.svg',
          name: 'Mottex corporation',
        },
        stories: [
          {
            type: 'image',
            url: '/images/stories/i_stories-a002.jpg',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
        ]
      },
      {
        creator: {
          logo: '/images/icons/ic_logo-mtx.svg',
          name: 'Mottex corporation',
        },
        stories: [
          {
            type: 'image',
            url: '/images/stories/i_stories-a002.jpg',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
        ]
      },
      {
        creator: {
          logo: '/images/icons/ic_logo-mtx.svg',
          name: 'Mottex corporation',
        },
        stories: [
          {
            type: 'image',
            url: '/images/stories/i_stories-a002.jpg',
            desc: 'Документирование результатов упрощает дальнейший контроль. Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
          {
            type: 'video',
            url: '/static/mx-video_test.mp4',
            desc: 'Порядок на площадке облегчает выполнение работ. При грамотном подходе, надёжная инженерная система уменьшает потери материалов в пересчёте на этап работ. Эксплуатация объекта начинается после завершения строительных работ. Согласованность действий упрощает управление проектом. Прежде всего, своевременная поставка материалов повышает долговечность объекта.'
          },
        ]
      },


    ];

    arr.forEach(element => {
      element.stories.forEach((data) => {
        switch(data.type) {
          case 'image':
            this.modal.querySelector('.splide__list').append(new AfLayoutImage(data).node());
          break;
          case 'video':
            this.modal.querySelector('.splide__list').append(new AfLayoutVideo(data).node());
          break;
        }
      }, '');

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

  openModal() {
    this.modal = document.createElement('div')
    this.modal.innerHTML = this.getTemplateModal()
    this.createStoriesSlides(this.modal)

    document.body.append(this.modal)
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
