import { AfStoryDescription } from "./AfStoryDescription"

export class AfLayoutVideo {
  constructor(params) {
    this.$el = document.createElement('div')
    this.data = params
    this.video = null
    this.isMuted = true // звук выключен по умолчанию
    this.onEnded = null
  }


  init() {
    this.$el.innerHTML = this.getTemplateLayout()
    this.$el.classList.add('af-stories-slide')

    if (this.data.slideIndex === 0) {
      this.$el.classList.add('is-active')
    }

    this.desc = new AfStoryDescription(this.data.desc)
    this.$el.querySelector('[data-desc-slot]').append(this.desc.node())

    this.video = this.$el.querySelector('video')
    this.video.muted = this.isMuted
    this.bindEvents()
  }


  bindEvents() {
    const playBtn = this.$el.querySelector('.af-stories-video__play')
    const muteBtn = this.$el.querySelector('.af-stories-video__mute')

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.togglePlay()
    })

    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.toggleMute()
    })

    // прогресс видео
    this.video.addEventListener('timeupdate', () => {
      if (this.video.duration) {
        const percent = (this.video.currentTime / this.video.duration) * 100
        const bar = this.$el.querySelector('.af-stories-video__progress .bar')
        if (bar) bar.style.width = percent + '%'
      }
    })

    // окончание видео
    this.video.addEventListener('ended', () => {
      if (typeof this.onEnded === 'function') this.onEnded()
    })
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play()
      this.$el.classList.add('is-playing')
    } else {
      this.video.pause()
      this.$el.classList.remove('is-playing')
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    this.video.muted = this.isMuted
    this.$el.classList.toggle('is-muted', this.isMuted)
  }

  play() {
    // если уже играет и не закончилось — не сбрасываем
    if (!this.video.paused && this.video.currentTime > 0 && this.video.currentTime < this.video.duration) {
      return
    }
    // иначе стартуем с начала
    if (this.video.currentTime >= this.video.duration) {
      this.video.currentTime = 0
    }
    this.video.play().catch(() => {})
    this.$el.classList.add('is-playing')
  }

  restart() {
    this.video.currentTime = 0
    this.video.play().catch(() => {})
    this.$el.classList.add('is-playing')
  }

  pause() {
    this.video.pause()
    this.$el.classList.remove('is-playing')
  }

  getTemplateLayout() {
    return `
      <div class="af-stories-slide__container">
        <div class="af-stories-slide__video">
          <video src="${this.data.url}" playsinline preload="metadata"></video>
        </div>
        <div class="af-stories-slide__footer">
          <div data-desc-slot></div>
          <div class="af-stories-slide__control">
            <div class="af-stories-video__play">p</div>
            <div class="af-stories-video__progress"><span class="bar"></span></div>
            <div class="af-stories-video__mute">m</div>
          </div>
        </div>
      </div>`
  }

  node() {
    this.init()
    return this.$el
  }
}
