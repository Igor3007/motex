import { AfLayoutVideo } from "./AfLayoutVideo"
import { AfLayoutImage } from "./AfLayoutImage"

export class AfLayoutSlide {
  constructor(params) {
    this.data = params.data
    this.$slide = document.createElement('div')
    this.$el = document.createElement('div')
    this.stories = []
    this.currentStoryIndex = 0
    this.rendered = false
    this.init()
  }

  init() {
    this.$el.innerHTML = this.getTemplate()
    this.$el.classList.add('splide__slide')
    this.create(this.data)
  }

  create(element) {
    this.$slide.classList.add('ssww')

    element.stories.forEach((data, index) => {
      let instance
      switch (data.type) {
        case 'image':
          instance = new AfLayoutImage({ ...data, slideIndex: index })
          break
        case 'video':
          instance = new AfLayoutVideo({ ...data, slideIndex: index })
          break
        default:
          return
      }
      this.stories.push(instance)
      this.$slide.append(instance.node())
    })

    this.$el.querySelector('[data-slides]').append(this.$slide)
  }

  getProgressBar() {
    return this.data.stories.map(() => '<li><span class="bar"></span></li>').join('')
  }

  getTemplate() {
    return `
      <div class="af-stories-box">
        <div class="af-stories-box__progress"><ul>${this.getProgressBar()}</ul></div>
        <div class="af-stories-box__user">
          <div class="af-stories-box__logo"><img src="${this.data.creator.logo}" alt=""></div>
          <div class="af-stories-box__name">${this.data.creator.name}</div>
        </div>
        <div class="af-stories-box__slides" data-slides></div>
      </div>`
  }

  /** Сброс состояния слайда: скрыть все истории, убрать прогресс */
  /** Сброс: вернуть слайд в исходное состояние — показываем первую историю */
  reset() {
    this.currentStoryIndex = 0

    this.stories.forEach((story, i) => {
      story.$el.classList.toggle('is-active', i === 0)

      if (story.desc) story.desc.reset()      // ← добавить

      if (story instanceof AfLayoutVideo) {
        story.pause()
        story.video.currentTime = 0
        const bar = story.$el.querySelector('.af-stories-video__progress .bar')
        if (bar) bar.style.width = '0%'
      }
    })

    const bars = this.$el.querySelectorAll('.af-stories-box__progress .bar')
    bars.forEach((bar) => (bar.style.width = '0%'))
  }

  /** Пауза всех историй на слайде */
  pauseAll() {
    this.stories.forEach((story) => {
      if (story instanceof AfLayoutVideo) story.pause()
    })
  }

  getHtml() {
    return this.$el
  }
}
