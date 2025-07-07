import { afLightbox } from "./af-lightbox";

export class TooltipAjax {

    constructor(params) {
        this.$items = document.querySelectorAll(params.el)
        this.tooltip = null;

        this.addEvents()
    }

    LoadTooltip(e, callback) {

        if (e.target.dataset.ajax) {
            this.ajaxLoadHtml(e, (text) => {
                callback({ text })
            })
        } else if (e.target.dataset.el) {
            if (document.querySelector(e.target.dataset.el)) {
                callback({
                    text: document.querySelector(e.target.dataset.el).outerHTML
                })
            }
        } else {
            callback({
                text: e.target.dataset.tooltip
            })
        }
    }

    ajaxLoadHtml(e, onload) {
        fetch(e.target.dataset.ajax)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.text();
            })
            .then(text => {
                onload(text)
            })
            .catch(error => {
                console.error('Ошибка TooltipAjax:', error);
            });
    }

    getTemplate(data) {
        let html = ` <div class="tooltip-box" ><div class="af-spiner" ></div></div> `;
        if (data) html = `<div class="tooltip-box" >${data.text}</div> `;
        return html;
    }

    positionTooltip(e) {
        const DomRect = e.target.getBoundingClientRect()
        const tooltipW = this.tooltip.clientWidth;
        const tooltipH = this.tooltip.clientHeight;
        const offset = 8;
        const bounds = 20;

        this.tooltip.style.left = (DomRect.x - (tooltipW / 2) + (bounds / 2)) + 'px'
        this.tooltip.style.top = (DomRect.y - tooltipH - (bounds / 2)) - offset + 'px'


        if (this.tooltip.getBoundingClientRect().left < bounds) {
            this.tooltip.classList.add('tooltip-box-item--left')
            this.tooltip.style.left = (DomRect.x - (DomRect.x / 2) + (bounds / 2)) + offset + 'px'
        }

        if (this.tooltip.getBoundingClientRect().right > (document.body.clientWidth - bounds)) {
            this.tooltip.classList.add('tooltip-box-item--right')
            this.tooltip.style.left = (DomRect.x - (tooltipW) + (bounds / 2)) + offset + 'px'
        }

        if (this.tooltip.getBoundingClientRect().top < bounds) {
            this.tooltip.classList.add('tooltip-box-item--top')
            this.tooltip.style.top = (DomRect.y + (bounds)) + offset + 'px'
        }
    }

    tooltipDesctop(e) {

        this.tooltipRemove()
        this.tooltip = document.createElement('div')
        this.tooltip.innerHTML = this.getTemplate(false)
        this.tooltip.classList.add('tooltip-box-item')

        document.body.append(this.tooltip)
        this.positionTooltip(e)

        //load data

        this.LoadTooltip(e, (response) => {
            this.tooltip.innerHTML = this.getTemplate(response)
            this.positionTooltip(e)
        })
    }

    tooltipPopup(e) {
        const tooltipPopup = new afLightbox({
            mobileInBottom: true
        })

        tooltipPopup.open(`<div class="popup-tooltip-box" >${this.getTemplate(false)}</div>`, () => {
            this.LoadTooltip(e, (response) => {
                let html = `<div class="popup-tooltip-box" >${this.getTemplate(response)}</div>`
                tooltipPopup.changeContent(html)
            })
        })
    }

    tooltipRemove() {
        !this.tooltip || this.tooltip.remove()
    }

    addEvents() {
        this.$items.forEach(item => {

            //for desctop
            if (document.body.clientWidth > 576) {

                item.addEventListener('mouseenter', e => {
                    this.tooltipDesctop(e)

                    //add event close on scroll
                    window.addEventListener('scroll', e => {
                        this.tooltipRemove()
                    })

                })

                //add event close on outher click
                item.addEventListener('mouseleave', e => {
                    this.tooltipRemove()
                })

                item.addEventListener('click', e => {
                    e.preventDefault()
                    e.stopPropagation()
                })

            } else {
                item.addEventListener('click', e => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.tooltipPopup(e)
                })
            }



        })
    }

}