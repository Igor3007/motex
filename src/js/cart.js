document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#vuecart')) {

        let vueApp = new Vue({
            el: '#vuecart',
            data: {

                json: [],
                need_cutter: false

            },
            created: function () {
                this.fetchData()
            },

            filters: {
                numberWithSpaces: function (value) {
                    if (!value) return '';
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                },
                formatDate: function (value) {
                    if (!value) return '';
                    const [day, month, year] = value.split('.');
                    const months = [
                        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
                    ];
                    const monthName = months[parseInt(month) - 1];
                    return `${day} ${monthName}`;
                }
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
                    let totalPrice = this.getPriceTotal(item)
                    if (item.sale) {
                        return (totalPrice - (totalPrice * (item.sale.percent / 100))).toFixed(0)
                    } else {
                        return totalPrice.toFixed(0)
                    }
                },

                getPriceTotal: function (item) {
                    return (Number(item.total) * Number(item.price.rub.unit))
                },

                counter_inc(index) {
                    if (this.json[index].total < 999) this.json[index].total++
                },
                counter_dec(index) {
                    if (this.json[index].total > 1) this.json[index].total--
                },
                counter_change(index, e) {

                    if (isNaN(e.target.value)) {
                        this.json[index].total = 1
                        return false
                    }

                    let total = e.target.value;
                    total = Number(total.replace(/\D/g, ''));

                    if (total == 0 && total <= 1) total = 1
                    if (total > 999) total = 999

                    return this.json[index].total = total;
                },

                counter_blur(index, e) {
                    if (!this.json[index].total) this.json[index].total = 1
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