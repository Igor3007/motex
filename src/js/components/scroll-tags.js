export class ScrollTags {

    constructor(params) {
        this.$el = params.el
        this.nextButton = this.$el.querySelector('[data-st="next"]')
        this.prevButton = this.$el.querySelector('[data-st="prev"]')
        this.container = this.$el.querySelector('[data-st="container"]');

        this.init()
    }

    init() {

        this.addEvents()

        if (this.$el.querySelector('.is-active')) {
            setTimeout(() => {
                this.scrollToElem(this.$el.querySelector('.is-active'), this.container);
            }, 300)
        }

        this.checkButton()


    }

    scrollToElem(elem, container) {
        var rect = elem.getBoundingClientRect();
        var rectContainer = container.getBoundingClientRect();

        let elemOffset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }

        let containerOffset = {
            top: rectContainer.top + document.body.scrollTop,
            left: rectContainer.left + document.body.scrollLeft
        }

        let leftPX = elemOffset.left - containerOffset.left + container.scrollLeft - (container.offsetWidth / 2) + (elem.offsetWidth / 2) + 5

        container.scrollTo({
            left: leftPX,
            behavior: 'smooth'
        });
    }

    scrollContainer(leftPX) {
        this.container.scrollTo({
            left: leftPX,
            behavior: 'smooth'
        });
    }

    next() {
        const leftPX = (this.container.scrollLeft + this.$el.clientWidth)
        this.scrollContainer(leftPX)

    }

    prev() {
        const leftPX = (this.container.scrollLeft - this.$el.clientWidth)
        this.scrollContainer(leftPX)
    }

    checkButton() {
        this.prevButton.setAttribute('disabled', this.container.scrollLeft == 0)
        this.nextButton.setAttribute('disabled', (this.container.offsetWidth + this.container.scrollLeft) == this.container.scrollWidth)

        let elemWidth = 0
        this.container.querySelectorAll('li').forEach(item => {
            elemWidth += item.offsetWidth
        })

        if (this.container.clientWidth > elemWidth) {
            this.$el.classList.add('is-hide-nav')
        } else {
            !this.$el.classList.contains('is-hide-nav') || this.$el.classList.remove('is-hide-nav')
        }

    }

    addEvents() {
        this.nextButton.addEventListener('click', e => this.next())
        this.prevButton.addEventListener('click', e => this.prev())
        this.container.addEventListener('scroll', e => this.checkButton())
    }

}

