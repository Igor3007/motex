document.addEventListener('DOMContentLoaded', function (event) {

    class SearchIndex {
        constructor(el) {
            this.vueApp = null;
            this.$el = el
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
                    input: ''
                },

                mounted: function () {
                    console.log('ee')
                },

                methods: {
                    focusInput() {
                        this.isFocus = true
                    },

                    blurInput() {
                        this.isFocus = false
                    }
                },

                computed: {

                },
            })
        }


    }

    document.querySelectorAll('[data-find="container"]').forEach(item => {
        window.SearchIndex = new SearchIndex(item)
    })
});