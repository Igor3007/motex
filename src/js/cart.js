document.addEventListener('DOMContentLoaded', function (event) {

    const aflightbox = Vue.component('afLightbox', {

        template: `
            <div class = "af-popup"
            @click = "closeOnWindow" :class = "{'af-popup--visible' : isopen, 'af-popup--mobile': deviceWidth <= 480} " >
                <div class="af-popup__bg" ></div>
                <div class="af-popup__wrp">
                    <div class="af-popup__container">
                        <div class="af-popup__close" @click="close()">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg>
                        </div>
                        <div class = "af-popup__content"> 
                            <slot><div>sllooottt</div></slot>
                        </div>
                    </div>
                </div>
            </div>
        `,

        name: 'aflightbox',

        data: function () {
            return {
                isopen: false,
                deviceWidth: document.body.clientWidth
            }
        },

        methods: {

            closeOnWindow(e) {
                if (!e.target.closest('.af-popup__content')) {
                    this.close()
                }
            },

            open() {
                this.isopen = true
            },

            close() {
                this.isopen = false
            }
        }
    })

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

                pricelist: [{
                        groupTitle: 'Прайс на услуги распила',
                        group: [{
                            title: 'Фанера, ОСП, ДВП, ДСП, МДФ, ХДФ',
                            items: [{
                                    name: 'Толщина от 3мм до 10мм, включительно',
                                    value: '120',
                                    unit: '₽/м.п.'
                                },
                                {
                                    name: 'Толщина от 11мм до 15мм, включительно',
                                    value: '160',
                                    unit: '₽/м.п.'
                                },
                                {
                                    name: 'Толщина от 16мм до 20мм, включительно',
                                    value: '200',
                                    unit: '₽/м.п.'
                                },
                                {
                                    name: 'Толщина от 21мм до 29мм, включительно',
                                    value: '300',
                                    unit: '₽/м.п.'
                                },
                            ]
                        }, {
                            title: 'ГСП, ЦСП, Green Board',
                            items: [{
                                name: 'Толщина от 30мм до 40мм, включительно',
                                value: '400',
                                unit: '₽/м.п.'
                            }, ]
                        }, {
                            title: 'Снять фаску 45 градус, диаметр до 5мм',
                            items: [{
                                name: 'Любая толщина',
                                value: '400',
                                unit: '₽/м.п.'
                            }, ]
                        }]
                    },
                    {
                        groupTitle: 'Прайс на услуги распила',
                        group: [{
                            title: 'Фанера, ОСП, ДВП, ДСП, МДФ, ХДФ',
                            items: [{
                                    name: 'Толщина от 3мм до 10мм, включительно | 1 поддон',
                                    value: '120',
                                    unit: '₽/м.п.'
                                },
                                {
                                    name: 'Толщина от 11мм до 15мм, включительно | 1 поддон',
                                    value: '160',
                                    unit: '₽/м.п.'
                                },
                                {
                                    name: 'Толщина от 16мм до 20мм, включительно | 1 поддон',
                                    value: '200',
                                    unit: '₽/м.п.'
                                },
                                {
                                    name: 'Толщина от 21мм до 29мм, включительно | 1 поддон',
                                    value: '300',
                                    unit: '₽/м.п.'
                                },
                            ]
                        }, {
                            title: 'ГСП, ЦСП, Green Board',
                            items: [{
                                name: 'Толщина от 30мм до 40мм, включительно',
                                value: '400',
                                unit: '₽/м.п.'
                            }, ]
                        }, {
                            title: 'Снять фаску 45 градус, диаметр до 5мм',
                            items: [{
                                name: 'Любая толщина',
                                value: '400',
                                unit: '₽/м.п.'
                            }, ]
                        }]
                    },
                ]

            },

            components: {
                aflightbox
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
                            this.json = data
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