document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#vuecart')) {

        let vueApp = new Vue({
            el: '#vuecart',
            data: {

                json: []

            },
            created: function () {
                this.fetchData()
            },
            methods: {
                fetchData() {
                    fetch('/static/cart.json', {
                            method: 'GET',
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            this.json = data
                        })
                },

                getPrice: function (item) {



                    return (Number(item.total) * Number(item.price.rub.unit)).toFixed(0)
                },

                getPriceSale: function (item) {
                    let totalPrice = (Number(item.total) * Number(item.price.rub.unit))
                    return (totalPrice - (totalPrice * (item.sale.percent / 100))).toFixed(0)
                },
            },

            computed: {
                productList: function () {
                    return this.json
                }
            }
        })

    }
});