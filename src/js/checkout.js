document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#vuecheckout')) {

        let vueApp = new Vue({
            el: '#vuecheckout',
            data: {

                json: [],
                need_cutter: false

            },
            created: function () {
                this.fetchData()
            },

            methods: {},

            computed: {
                productList: function () {
                    return this.json
                }
            }
        })

    }
});