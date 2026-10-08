import Splide from "@splidejs/splide";

import { AfLayoutImage } from "./afstories/AfLayoutImage";
import { AfLayoutVideo } from "./afstories/AfLayoutVideo";
import { AfLayoutSlide } from "./afstories/AfLayoutSlide";


export class AfStories {
  constructor() {
    this.$el = document.querySelector('.af-stories')
    this.modal = null
    this.sliderPopup = null
    this.slides = []
    this.currentSlideIndex = 0
    this.isPaused = false
    this._raf = null
    this._rafPausedAt = 0
    this._storyStartTime = 0
    this._holdTimer = null
    this._isHolding = false
    this._pointerStartX = 0
    this._pointerMoved = false
    this._isTransitioning = false
    this._data = null

    this.init()
  }

  init() {
    this.initSliderSelect()
    this.addEvents()
  }

  initSliderSelect() {
    new Splide('[data-slider="af-stories-select"]', {
      perPage: 1,
      perMove: 1,
      fixedWidth: '80px',
      drag: 'free',
      snap: false,
      arrows: false,
      pagination: false,
      flickPower: 300,
      flickMaxPages: 1,
      gap: 24
    }).mount()
  }

  get data() {
    return this._data || []
  }

  async getStoriesData() {
    const res = await fetch('/static/stories.json')
    if (!res.ok) throw new Error(`stories.json ${res.status}`)
    return res.json()
  }

  createStoriesSlides() {
    this.slides = []
    const list = this.modal.querySelector('.splide__list')
    list.innerHTML = ''

    this._data.forEach((element) => {
      const slide = new AfLayoutSlide({ data: element })
      this.slides.push(slide)
      list.append(slide.getHtml())
    })
  }

  getStoriesSlider() {
    return `
      <div class="splide">
        <div class="splide__track"><div class="splide__list"></div></div>
      </div>`
  }

  getTemplateModal() {
    return `
      <div class="af-series-container">
        <div class="af-series-overlay">
          <div class="af-series-content">${this.getStoriesSlider()}</div>
        </div>
      </div>`
  }

  initSliderPopup() {
    const spl = this.modal.querySelector('.splide')

    this.sliderPopup = new Splide(spl, {
      perPage: 1,
      perMove: 1,
      arrows: false,
      pagination: false,
      gap: -12,
      fixedHeight: '92vh',
      fixedWidth: 'calc(92vh * 50 / 89)',
      focus: 'center',
      padding: { left: '50%', right: '50%' },
      wheel: false,
      wheelMinThreshold: 200,
      wheelSleep: 50,
      updateOnMove: true,
      start: this.currentSlideIndex,
      isNavigation: true, // делает слайды кликабельны
      dragMinThreshold: 300, // срабатывание после 20px
      drag: true,
      mediaQuery: 'min',
      breakpoints: {
        576: {
          gap: 0,
          drag: false,
        },

      }
    })


    this.sliderPopup.on('moved', (newIndex) => {
      this.onSlideChange(newIndex)
    })

    this.sliderPopup.mount()
  }

  onSlideChange(newIndex) {

    clearTimeout(this._transitionTimeout)
    this._isTransitioning = false

    if (newIndex === this.currentSlideIndex) return

    const prevIndex = this.currentSlideIndex
    const prevSlide = this.slides[prevIndex]

    // останавливаем всё на предыдущем и сбрасываем его
    if (prevSlide) {
      this.stopTimer()
      prevSlide.pauseAll()
      prevSlide.reset() // покажет первую историю, обнулит прогресс
    }

    this.currentSlideIndex = newIndex

    // новый слайд — в дефолт и запускаем
    this.slides[newIndex].reset()
    this.playCurrentStory()
  }

  async openModal(index = 0) {
    const item = this.$el.querySelectorAll('.af-stories-item')[index]
    const circle = item?.querySelector('.af-stories-circle')

    circle?.classList.add('is-loading')

    // загружаем данные один раз
    if (!this._data) {
      try {
        this._data = await this.getStoriesData()
      } catch (e) {
        console.error('[AfStories] load failed', e)
        this._data = []
        circle?.classList.remove('is-loading')
        return
      }
    }

    circle?.classList.remove('is-loading')

    this.currentSlideIndex = index

    this.modal = document.createElement('div')
    this.modal.innerHTML = this.getTemplateModal()
    this.createStoriesSlides()
    document.body.append(this.modal)

    this.initSliderPopup()

    requestAnimationFrame(() => this.playCurrentStory())

    this.modal.querySelector('.af-series-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('af-series-overlay')) this.closeModal()
    })

    this._onKeyDown = (e) => {
      if (e.code === 'Space') { e.preventDefault(); this.togglePause() }
      if (e.code === 'Escape') this.closeModal()
      if (e.code === 'ArrowRight') this.nextStory()
      if (e.code === 'ArrowLeft') this.prevStory()
    }
    document.addEventListener('keydown', this._onKeyDown)
  }

  closeModal() {
    this.stopTimer()
    this.slides.forEach((s) => { s.pauseAll(); s.reset() })
    document.removeEventListener('keydown', this._onKeyDown)
    this.modal.remove()
    this.modal = null
    this.sliderPopup = null
  }

  // ---------- Воспроизведение ----------

  playCurrentStory() {
    this.stopTimer()

    const slide = this.slides[this.currentSlideIndex]
    if (!slide) return

    const storyIndex = slide.currentStoryIndex
    const story = slide.stories[storyIndex]
    if (!story) return

    // показать только активную
    slide.stories.forEach((s, i) => {
      s.$el.classList.toggle('is-active', i === storyIndex)
    })

    this.updateSlideProgress(slide, storyIndex, 0)
    this.attachSlideGestures(slide)

    this.isPaused = false

    if (story instanceof AfLayoutVideo) {
      story.onEnded = () => this.nextStory()

      // удалим старый обработчик, если был
      if (story._progressHandler) {
        story.video.removeEventListener('timeupdate', story._progressHandler)
      }
      story._progressHandler = () => {
        if (!story.video.duration) return
        const percent = (story.video.currentTime / story.video.duration) * 100
        this.updateSlideProgress(slide, storyIndex, percent)
      }
      story.video.addEventListener('timeupdate', story._progressHandler)

      story.play()
    } else {
      // image — timer через RAF
      this._storyStartTime = performance.now()
      this._rafPausedAt = 0
      const duration = story.duration
      const tick = (now) => {
        const elapsed = now - this._storyStartTime
        const percent = Math.min((elapsed / duration) * 100, 100)
        this.updateSlideProgress(slide, storyIndex, percent)
        if (percent < 100) {
          this._raf = requestAnimationFrame(tick)
        } else {
          this.nextStory()
        }
      }
      this._raf = requestAnimationFrame(tick)
    }

    this.preloadNext()
  }

  updateSlideProgress(slide, storyIndex, percent) {
    // если слайд уже не активный — не трогаем его бары
    if (this.slides[this.currentSlideIndex] !== slide) return

    const bars = slide.$el.querySelectorAll('.af-stories-box__progress .bar')
    bars.forEach((bar, i) => {
      if (i < storyIndex) bar.style.width = '100%'
      else if (i === storyIndex) bar.style.width = percent + '%'
      else bar.style.width = '0%'
    })
  }

  // ---------- Навигация ----------

  nextStory() {
    if (this._isTransitioning) return
    const slide = this.slides[this.currentSlideIndex]
    if (!slide) return

    this.stopTimer()

    const prev = slide.stories[slide.currentStoryIndex]
    if (prev instanceof AfLayoutVideo) {
      prev.pause()
      if (prev._progressHandler) {
        prev.video.removeEventListener('timeupdate', prev._progressHandler)
        prev._progressHandler = null
      }
    }

    if (slide.currentStoryIndex + 1 >= slide.stories.length) {

      setTimeout(() => {
        this.nextSlide()
      }, 100)

      //alert('next slide')

    } else {
      slide.currentStoryIndex++
      this.playCurrentStory()
    }
  }

  prevStory() {
    const slide = this.slides[this.currentSlideIndex]
    if (!slide) return

    this.stopTimer()

    const prev = slide.stories[slide.currentStoryIndex]
    if (prev instanceof AfLayoutVideo) {
      prev.pause()
      if (prev._progressHandler) {
        prev.video.removeEventListener('timeupdate', prev._progressHandler)
        prev._progressHandler = null
      }
    }

    if (slide.currentStoryIndex > 0) {
      slide.currentStoryIndex--
      this.playCurrentStory()
    } else {
      // первая история текущего слайда — идём на предыдущий слайд
      this.prevSlide()
    }
  }

  nextSlide() {
    if (this._isTransitioning) return
    const next = this.currentSlideIndex + 1
    if (next >= this.slides.length) {
      this.closeModal()
      return
    }
    this._isTransitioning = true

    // подстраховка: если moved не придёт — сбросим флаг сами
    clearTimeout(this._transitionTimeout)
    this._transitionTimeout = setTimeout(() => {
      this._isTransitioning = false
    }, 600)

    this.sliderPopup.go(next)
  }

  prevSlide() {
    const prev = this.currentSlideIndex - 1
    if (prev < 0) return
    this.sliderPopup.go(prev)
  }

  // ---------- Пауза / продолжение ----------

  togglePause() {
    this.isPaused ? this.resume() : this.pause()
  }

  pause() {
    if (this.isPaused) return
    this.isPaused = true

    const slide = this.slides[this.currentSlideIndex]
    if (!slide) return
    const story = slide.stories[slide.currentStoryIndex]

    if (story instanceof AfLayoutVideo) {
      story.pause()
    } else if (story instanceof AfLayoutImage && this._raf) {
      cancelAnimationFrame(this._raf)
      this._raf = null
      this._rafPausedAt = performance.now() - this._storyStartTime
    }
  }

  resume() {
    if (!this.isPaused) return
    this.isPaused = false

    const slide = this.slides[this.currentSlideIndex]
    if (!slide) return
    const story = slide.stories[slide.currentStoryIndex]

    if (story instanceof AfLayoutVideo) {
      story.play()
    } else if (story instanceof AfLayoutImage) {
      // сдвигаем startTime так, чтобы продолжить с того же места
      this._storyStartTime = performance.now() - this._rafPausedAt
      const duration = story.duration
      const tick = (now) => {
        const elapsed = now - this._storyStartTime
        const percent = Math.min((elapsed / duration) * 100, 100)
        this.updateSlideProgress(slide, slide.currentStoryIndex, percent)
        if (percent < 100) {
          this._raf = requestAnimationFrame(tick)
        } else {
          this.nextStory()
        }
      }
      this._raf = requestAnimationFrame(tick)
    }
  }

  stopTimer() {
    if (this._raf) {
      cancelAnimationFrame(this._raf)
      this._raf = null
    }
  }

  // ---------- Жесты: long-press + тап по зонам ----------

  attachSlideGestures(slide) {
    const zone = slide.$slide
    if (!zone || zone._gesturesAttached) return
    zone._gesturesAttached = true

    const HOLD_MS = 200
    const MOVE_TOLERANCE = 10

    const isActiveSlide = () => this.slides[this.currentSlideIndex] === slide
    const isControlTarget = (e) =>
      !!(e.target.closest &&
        (e.target.closest('.af-stories-slide__control') ||
         e.target.closest('.af-stories-slide__desc-more')))

    const onPointerDown = (e) => {
      if (!isActiveSlide()) return
      if (e.button !== undefined && e.button !== 0) return
      if (isControlTarget(e)) return          // ← не начинаем жест на кнопках

      e.stopPropagation()

      this._pointerStartX = e.clientX
      this._pointerMoved = false
      this._isHolding = false

      this._holdTimer = setTimeout(() => {
        if (this._pointerMoved) return
        if (!isActiveSlide()) return
        this._isHolding = true
        this.pause()
        zone.classList.add('is-holding')
      }, HOLD_MS)
    }

    const onPointerMove = (e) => {
      if (!this._holdTimer) return
      if (Math.abs(e.clientX - this._pointerStartX) > MOVE_TOLERANCE) {
        this._pointerMoved = true
        clearTimeout(this._holdTimer)
        this._holdTimer = null
      }
    }

    const onPointerUp = (e) => {
      clearTimeout(this._holdTimer)
      this._holdTimer = null

      if (isControlTarget(e)) {               // ← тоже игнор
        this._isHolding = false
        zone.classList.remove('is-holding')
        return
      }

      if (!isActiveSlide()) {
        this._isHolding = false
        zone.classList.remove('is-holding')
        return
      }

      if (this._isHolding) {
        this._isHolding = false
        zone.classList.remove('is-holding')
        this.resume()
        return
      }

      if (this._pointerMoved) return

      const rect = zone.getBoundingClientRect()
      const x = e.clientX - rect.left
      const ratio = x / rect.width

      if (ratio < 0.3) {
        this.prevStory()
      } else {
        this.nextStory()
      }
    }

    const onPointerCancel = () => {
      clearTimeout(this._holdTimer)
      this._holdTimer = null
      if (this._isHolding) {
        this._isHolding = false
        zone.classList.remove('is-holding')
        if (isActiveSlide()) this.resume()
      }
    }

    zone.addEventListener('pointerdown', onPointerDown)
    zone.addEventListener('pointermove', onPointerMove)
    zone.addEventListener('pointerup', onPointerUp)
    zone.addEventListener('pointercancel', onPointerCancel)
    zone.addEventListener('pointerleave', onPointerCancel)
  }

  // ---------- Preload ----------

  preloadNext() {
    const slide = this.slides[this.currentSlideIndex]
    if (!slide) return

    const nextStory = slide.stories[slide.currentStoryIndex + 1]
    if (nextStory) return this.preloadStory(nextStory)

    const nextSlide = this.slides[this.currentSlideIndex + 1]
    if (nextSlide && nextSlide.stories[0]) return this.preloadStory(nextSlide.stories[0])
  }

  preloadStory(story) {
    if (story instanceof AfLayoutImage) {
      const img = new Image()
      img.src = story.data.url
    } else if (story instanceof AfLayoutVideo) {
      story.video.preload = 'auto'
      // форсируем загрузку метаданных
      if (story.video.readyState === 0) story.video.load()
    }
  }

  // ---------- Инициализация кликов по превью ----------

  addEvents() {
    this.$el.querySelectorAll('.af-stories-item').forEach((item, index) => {
      item.addEventListener('click', () => this.openModal(index))
    })
  }
}
