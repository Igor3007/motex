document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#vuecheckout')) {

        let vueApp = new Vue({
            el: '#vuecheckout',
            data: {

                json: [],
                need_cutter: false,
                select_in_map: false,
                receipt_type: 'delivery',

            },
            created: function () {
                //this.fetchData()
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