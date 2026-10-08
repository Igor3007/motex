import { AfStoryDescription } from "./AfStoryDescription"

export class AfLayoutImage {
  constructor(params) {
    this.$el = document.createElement('div')
    this.data = params
    this.duration = params.duration || 10000 // по умолчанию 10 сек
  }

  init() {
    this.$el.innerHTML = this.getTemplateLayout()
    this.$el.classList.add('af-stories-slide')

    if (this.data.slideIndex === 0) {
      this.$el.classList.add('is-active')
    }

    this.desc = new AfStoryDescription(this.data.desc)
    this.$el.querySelector('[data-desc-slot]').append(this.desc.node())
  }

  getTemplateLayout() {
    return `
      <div class="af-stories-slide__container">
        <div class="af-stories-slide__picture">
          <picture><img src="${this.data.url}" alt=""></picture>
        </div>
        <div class="af-stories-slide__footer">
          <div data-desc-slot></div>
        </div>
      </div>`
  }

  node() {
    this.init()
    return this.$el
  }
}
