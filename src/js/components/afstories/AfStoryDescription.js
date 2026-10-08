export class AfStoryDescription {
  constructor(text) {
    this.text = text || ''
    this.isLong = this.text.length > 100
    this.isOpen = false
    this.$el = null
  }

  node() {
    this.$el = document.createElement('div')
    this.$el.classList.add('af-stories-slide__desc')
    if (this.isLong) this.$el.classList.add('is-long')

    this.$el.innerHTML = `
      <div class="af-stories-slide__desc-text">${this.text}</div>
      ${this.isLong ? '<button type="button" class="af-stories-slide__desc-more">Ещё</button>' : ''}
    `

    if (this.isLong) {
      const btn = this.$el.querySelector('.af-stories-slide__desc-more')
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.toggle()
      })
      btn.addEventListener('pointerdown', (e) => e.stopPropagation())
      btn.addEventListener('pointerup', (e) => e.stopPropagation())
    }

    return this.$el
  }

  toggle() {
    this.isOpen = !this.isOpen
    this.$el.classList.toggle('is-open', this.isOpen)
    const btn = this.$el.querySelector('.af-stories-slide__desc-more')
    if (btn) btn.textContent = this.isOpen ? 'Свернуть' : 'Ещё'
  }

  reset() {
    this.isOpen = false
    if (!this.$el) return
    this.$el.classList.remove('is-open')
    const btn = this.$el.querySelector('.af-stories-slide__desc-more')
    if (btn) btn.textContent = 'Ещё'
  }
}
