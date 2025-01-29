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
                    isMobile: document.body.clientWidth <= 768
                },

                mounted: function () {
                    window.addEventListener('resize', () => {
                        this.isMobile = document.body.clientWidth <= 768
                    })
                },

                methods: {
                    focusInput() {
                        this.isFocus = true
                    },

                    blurInput() {
                        if (!this.isMobile) {
                            this.isFocus = false
                        }
                    },

                    selectQuery(item) {
                        this.input = item
                    },

                    fetchData() {
                        if (this.input.length > 2) {

                            let formData = new FormData()
                            formData.append('q', this.input)

                            // let query = fetch('../static/search.json', {
                            //     method: 'POST',
                            //     body: formData
                            // })

                            let query = fetch('../static/search.json', {
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