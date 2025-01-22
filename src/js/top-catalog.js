document.addEventListener('DOMContentLoaded', function (event) {

    class TopCatalog {
        constructor(params) {
            this.html = params.html
            this.vueApp = null;
            this.$el = null
            this.init()
        }

        init() {
            this.$el = document.createElement('div')
            this.$el.innerHTML = this.html
            document.body.append(this.$el)

            this.startVue()
        }

        startVue() {
            this.vueApp = new Vue({
                el: this.$el,
                data: {
                    isOpen: true,
                    dataJSON: [],
                },

                mounted: function () {
                    this.getCatalogJSON()
                    this.isPageHidden()
                },

                methods: {
                    getCatalogJSON: function () {
                        let query = fetch('/static/top-catalog.json', {
                            method: 'GET',
                        })

                        query
                            .then((response => response.json()))
                            .then((data) => {
                                this.dataJSON = data
                            })
                    },

                    closePopup() {
                        this.isOpen = false
                    },

                    openPopup() {
                        this.isOpen = true
                    },

                    isPageHidden() {
                        //document.body.classList.toggle('page-hidden', this.isOpen)
                    }
                },

                computed: {
                    listcatalog() {
                        return this.dataJSON
                    }
                },



            })
        }
    }

    document.querySelectorAll('[data-menu="burger"]').forEach(item => {
        item.addEventListener('click', () => {

            if (!window.TopCatalog) {
                let query = fetch('/_popup-top-catalog.html', {
                    method: 'GET',
                })

                query
                    .then((response) => response.text())
                    .then((html) => {
                        window.TopCatalog = new TopCatalog({
                            html
                        })
                    })
            } else {
                window.TopCatalog.vueApp.openPopup()
            }



        })
    })
});