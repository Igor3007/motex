document.addEventListener('DOMContentLoaded', function (event) {



    if (document.querySelector('#vuecart')) {

        let vueApp = new Vue({
            el: '#vuecart',
            data: {

                json: [],
                isPageLoading: true,
                need_cutter: false,
                isOpenSaleDropdown: false,
                discounts: [],
                promocode: '',
                isLoadPromodode: false,
                removeList: [],
                fileArray: [],
                isSelectAllCheckbox: false,
                pricelist: []
            },

            components: {
                vueAflightbox
            },

            created: function () {
                this.fetchData()

            },

            filters: {
                numberWithSpaces: function (value) {
                    if (!value) return '';
                    value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    return value.toString(2)
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
                },
                convertWeight: function (value) {
                    value = Number(value)

                    if (value < 1) {
                        return (value * 1000).toFixed(2) + ' г'; // Меньше 1 кг -> граммы
                    } else if (value >= 1000) {
                        return (value / 1000).toFixed(2) + ' т'; // Больше или равно 1000 кг -> тонны
                    } else {
                        return value.toFixed(2) + ' кг'; // Остальное -> килограммы
                    }
                }
            },

            methods: {
                fetchData() {
                    fetch('/static/cart.json', {
                            method: 'GET',
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            this.json = data.products
                            this.pricelist = data.services
                            this.getPromotion()
                            this.isPageLoading = false
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

                getPromotion() {

                    let sale = this.getDiscountProduct

                    this.discounts.push({
                        name: 'Акция',
                        sale,
                    })

                },

                addPromocode() {
                    if (this.promocode) {
                        if (this.discounts.find(item => item.name == this.promocode)) {
                            return alert('Такой промокод уже добавлен')
                        }

                        this.isLoadPromodode = true;
                        let data = {
                            code: this.promocode
                        }

                        /* fetch('/endpoint', {
                                method: 'POST',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                this.isLoadPromodode = false;
                                this.isOpenSaleDropdown = true;
                                if(data.status) {
                                    this.discounts.push({
                                        name: this.promocode,
                                        sale: data.sale,
                                    })
                                }
                            }) */

                        setTimeout(() => {
                            this.isLoadPromodode = false;
                            this.isOpenSaleDropdown = true;
                            this.discounts.push({
                                name: this.promocode,
                                sale: 2500,
                            })
                        }, 2000)
                    }
                },

                removeSelected() {
                    if (confirm('Удалить выбранныые товары?')) {

                        for (let i = this.json.length - 1; i >= 0; i--) {
                            if (this.removeList.includes(i)) {
                                this.json.splice(i, 1);
                            }
                        }

                        this.removeList = []
                        this.isSelectAllCheckbox = false
                    }
                },

                removeItem(i) {
                    if (confirm('Удалить товар ?')) {
                        this.json.splice(i, 1);
                    }
                },

                changeFileInput(e) {

                    let mimeType = [
                        'image/jpeg',
                        'application/x-zip-compressed',
                        'image/png',
                    ]

                    let files = Array.from(e.target.files);

                    if ((files.length + this.fileArray.length) > 10) {
                        alert('Допустимо не более 10 файлов, лишние файлы были удалены')
                    }

                    for (let key in files) {

                        if (!mimeType.includes(files[key].type)) {
                            alert('Не поддерживаемый тип файла ' + files[key].name)
                            break;
                        }

                        if (files[key].size > 50000000) {
                            alert('Допустимы файлы не более 50мБ \n' + files[key].name)
                            break;
                        }

                        if (this.fileArray.length < 10) {
                            this.fileArray.push(files[key])
                        }

                    }

                },

                removeAttachFile(i) {
                    this.fileArray.splice(i, 1);
                },

                openPopupPrice() {
                    this.$refs.popup.open()
                },

                openPopupOneClick() {
                    this.$refs.oneclick.open()
                }


            },

            computed: {
                productList: function () {
                    return this.json
                },

                getCostProducts() {
                    return this.json.reduce((acc, item) => {
                        return acc + Number(this.getPrice(item))
                    }, 0)
                },

                getTotalWeight() {
                    return this.json.reduce((acc, item) => {
                        return acc + (Number(item.weight) * item.total)
                    }, 0).toFixed(1)
                },

                getDiscountProduct() {
                    let str = this.json.reduce((acc, item) => {
                        return item.sale ? acc + (this.getPriceTotal(item) * (item.sale.percent / 100)) : acc
                    }, 0)

                    return Number(str.toFixed(2))
                },

                getTotalDiscount() {

                    let sumTotalDiscount = this.discounts.reduce((acc, item) => {
                        return acc + item.sale
                    }, 0)

                    return sumTotalDiscount
                },

                getTotalPriceOrder() {
                    return this.getCostProducts - this.getTotalDiscount
                }
            },

            watch: {
                getCostProducts() {
                    for (let key in this.discounts) {
                        if (this.discounts[key].name == 'Акция') {
                            this.discounts[key].sale = this.getDiscountProduct
                        }
                    }
                },

                isSelectAllCheckbox() {
                    if (this.isSelectAllCheckbox) {
                        this.json.forEach((item, i) => this.removeList.push(i))
                    } else {
                        this.removeList = []
                    }
                }
            }
        })

    }
});