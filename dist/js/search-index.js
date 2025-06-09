document.addEventListener('DOMContentLoaded', function (event) {

    class SearchIndex {
        constructor(el) {
            this.vueApp = null;
            this.$el = el
            this.input = ''
            this.init()
        }

        init() {
            this.startVue()
        }

        startVue() {
            this.vueApp = new Vue({
                el: this.$el,
                data: {
                    isFocus: false,
                    input: '',
                    dataJSON: false,
                    isMobile: document.body.clientWidth <= 768,

                },

                mounted: function () {
                    window.addEventListener('resize', () => {
                        this.isMobile = document.body.clientWidth <= 768
                    })
                },

                methods: {

                    lockScroll(val) {
                        if (val) {
                            //fix iOS body scroll
                            if (this.isiOS) {
                                document.documentElement.classList.add('safari-fixed')
                                document.body.style.marginTop = `-${ window.scrollY }px`
                            }
                            document.body.classList.add('page-hidden')
                        } else {

                            //fix iOS body scroll
                            let documentBody = document.body

                            if (this.isiOS) {
                                if (document.documentElement.classList.contains('safari-fixed')) document.documentElement.classList.remove('safari-fixed')
                                const bodyMarginTop = parseInt(documentBody.style.marginTop, 10)
                                documentBody.style.marginTop = ''
                                if (bodyMarginTop || bodyMarginTop === 0) window.scrollTo(0, -bodyMarginTop)
                            }

                            documentBody.classList.remove('page-hidden')
                        }
                    },

                    focusInput() {

                        if (!this.isFocus && this.isiOS) {
                            this.$refs.searchInput.blur()
                        }

                        this.isFocus = true
                        this.lockScroll(true)


                    },

                    blurInput() {
                        if (!this.isMobile) {
                            this.isFocus = false
                        }

                        this.lockScroll(false)
                    },

                    closePopup() {
                        this.isFocus = false
                        this.lockScroll(false)
                    },

                    selectQuery(item) {
                        this.input = item
                    },

                    fetchData() {
                        if (this.input.length > 2) {

                            let formData = new FormData()
                            formData.append('q', this.input)

                            // let query = fetch('/static/search.json', {
                            //     method: 'POST',
                            //     body: formData
                            // })

                            let query = fetch('/static/search.json', {
                                method: 'GET',
                            })

                            query
                                .then((response) => response.json())
                                .then((data) => this.dataJSON = data)
                        } else {
                            this.dataJSON = false
                        }
                    }
                },

                computed: {
                    searchResult() {
                        return this.dataJSON ? this.dataJSON : false
                    },

                    isiOS() {
                        return /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
                    }
                },

                watch: {
                    'input': function () {
                        this.fetchData()
                    }
                }
            })
        }


    }

    document.querySelectorAll('[data-find="container"]').forEach(item => {
        window.SearchIndex = new SearchIndex(item)
    })
});