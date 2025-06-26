import Vue from "vue/dist/vue.esm.js";
import { loadYmapsApi } from "../../components/load-ymaps-api";

let vueCheckout = new Vue({
    el: '#vuecheckout',
    data: {

        products: [],
        discounts: [],
        timer: null,
        need_cutter: false,
        select_in_map: false,
        receipt_type: 'pickup',
        ymapSelectAddress: null,
        placemark: null,
        ymapStoreAddress: null,
        suggestArray: [],
        isOpenSuggest: false,
        errorLog: null,
        coordinatesDelivery: null,
        fileArray: [],
        isLoadPromocode: false,
        isLoadOrder: false,
        isPageLoading: false,
        isOpenSaleDropdown: false,
        promocode: '',
        pricelist: [],
        deliveryType: {
            delivery: 'Доставка',
            pickup: 'Самовывоз',
        },

        recipient_name: '',
        recipient_phone: '',
        recipient_email: '',

        addressDelivery: null,
        entranceDelivery: null,
        officeDelivery: null,
        floorDelivery: null,
        intercomDelivery: null,

    },
    created: function () {
        this.fetchData();

    },

    mounted: function () {

        loadYmapsApi(() => {
            if (this.receipt_type == 'pickup') {
                this.initStroreInMap()
            }
        })

    },

    methods: {

        fetchData() {
            fetch('/static/checkout.json', {
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((data) => {
                    this.products = data.products
                    this.discounts = data.discounts
                    this.pricelist = data.services
                })
        },

        declination: function (value, words) {
            value = Number(value);
            value = Math.abs(value) % 100;
            var num = value % 10;
            if (value > 10 && value < 20) return words[2];
            if (num > 1 && num < 5) return words[1];
            if (num == 1) return words[0];
            return words[2];
        },

        getSuggestFromYmaps(e) {

            clearTimeout(this.timer)

            this.timer = setTimeout(() => {
                ymaps.ready(() => {
                    ymaps.suggest(e.target.value).then(
                        (items) => {
                            this.suggestArray = items.map(elem => ({
                                text: elem.displayName,
                                value: elem.value,
                            }));
                        },

                        (error) => {
                            console.err('Error getSuggestFromYmaps ' + error)
                        }
                    )
                })
            }, 300)

        },

        geoCodeCoordinates(arr) {

            ymaps.geocode(arr).then(

                (res) => {
                    const addressLine = res.geoObjects.get(0).getAddressLine()
                    this.addressDelivery = addressLine
                    this.placemark.properties.set('balloonContent', addressLine);
                },

                (err) => {
                    console.error('error: geoCodeCoordinates')
                }
            );


        },

        geoCode(str) {

            if (!str || !this.ymapSelectAddress) return false

            ymaps.geocode(str).then(

                (res) => {
                    this.coordinatesDelivery = res.geoObjects.get(0).geometry.getCoordinates()
                    this.placemark.geometry.setCoordinates(this.coordinatesDelivery);
                    this.placemark.properties.set('balloonContent', this.coordinatesDelivery);
                    this.ymapSelectAddress.setCenter(this.coordinatesDelivery)
                },

                (err) => {
                    console.error('error: SelectAddressYmaps')
                }
            );
        },

        blurSuggest(e) {
            setTimeout(() => {
                this.isOpenSuggest = false
            }, 100)
        },

        selectedSuggest(item) {
            this.addressDelivery = String(item.text)
            this.geoCode(String(item.text))
        },

        focusSuggest() {
            this.isOpenSuggest = true
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

        initStroreInMap() {
            ymaps.ready(() => {
                this.ymapStoreAddress = new ymaps.Map('store-in-map', {
                    center: [55.76, 37.64],
                    zoom: 16,
                    type: 'yandex#map',
                    controls: [],
                }, {
                    searchControlProvider: 'yandex#search',
                    suppressMapOpenBlock: true,
                    zoomControlPosition: {
                        right: 32,
                        top: 32
                    },
                });

                this.ymapStoreAddress.geoObjects
                    .add(new ymaps.Placemark([55.76, 37.64], {
                        balloonContent: 'Челябинск, Троицкий Тракт, д. 17'
                    }, {
                        preset: 'islands#blueShoppingIcon',
                        iconColor: '#19beff'
                    }))

            });
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

        getPromotion() {

            let sale = this.getDiscountProduct

            this.discounts.push({
                name: 'Акция',
                sale,
            })

        },
        addPromocode() {
            if (this.promocode) {

                if (this.discounts.find(item => item.name == this.promocode) || this.isLoadPromocode) {
                    return alert('Такой промокод уже добавлен')
                }

                this.isLoadPromocode = true;
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
                        this.isLoadPromocode = false;
                        this.isOpenSaleDropdown = true;
                        if(data.status) {
                            this.isLoadPromocode = false;
                            this.isOpenSaleDropdown = true;
                            this.discounts.push({
                                name: this.promocode,
                                sale: 2500,
                            })
                            this.promocode = ''
                        }
                    }) */

                setTimeout(() => {

                    this.isLoadPromocode = false;
                    this.isOpenSaleDropdown = true;
                    this.discounts.push({
                        name: this.promocode,
                        sale: 2500,
                    })
                    this.promocode = ''
                }, 2000)
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

                let errlog = [];

                if (!mimeType.includes(files[key].type)) {
                    alert('Не поддерживаемый тип файла ' + files[key].name)
                    break;
                }

                if (files[key].size > 50000000) {
                    alert('Допустимы файлы не более 50мБ \n' + files[key].name)
                    break;
                }

                for (let fileKey in this.fileArray) {
                    if (this.fileArray[fileKey].size == files[key].size) {
                        alert('Такой файл уже добавлен')
                        errlog.push(files[key].name)
                        break;
                    }
                }

                if (this.fileArray.length < 10 && !errlog.length) {
                    this.fileArray.push(files[key])
                }

            }

        },
        openPopupPrice() {
            this.$refs.popup.open()
        },
        openPopupOneClick() {
            this.$refs.oneclick.open()
        },
        addPromocodeOnEnter(e) {
            if (e.code == 'Enter') this.addPromocode()
        },
        sendOrder() {
            console.log('send order')
            window.location.href = '/pages/order-success.html'
        }
    },

    computed: {
        productList: function () {
            return this.products
        },
        getTotalWeight() {
            return this.products.reduce((acc, item) => {
                return acc + (Number(item.weight) * item.total)
            }, 0).toFixed(1)
        },
        getTotalPriceOrder() {
            let total = Number(this.getCostProducts - this.getTotalDiscount).toFixed(2)
            return total > 0 ? total : '0'
        },
        getCostProducts() {
            return this.products.reduce((acc, item) => {
                return acc + Number(this.getPrice(item))
            }, 0)
        },
        getTotalDiscount() {
            let sumTotalDiscount = this.discounts.reduce((acc, item) => {
                return acc + item.sale
            }, 0)
            return sumTotalDiscount
        },

        isValidationOrder() {

            if (this.receipt_type == 'pickup') {
                if (!this.recipient_name || !this.recipient_phone) {
                    this.errorLog = 'Для оформления заказа заполните необходимые поля с данными:<span>— имя получателя *</span> <span>— номер телефона *</span>'
                    return true
                }
            }

            if (this.receipt_type == 'delivery') {
                if (!this.recipient_name || !this.recipient_phone || !this.addressDelivery) {
                    this.errorLog = 'Для оформления заказа заполните необходимые поля с данными:<span>— улица, дом *</span> <span>— имя получателя *</span> <span>— номер телефона *</span> '
                    return true
                }
            }


            return false

        }
    },

    watch: {
        select_in_map() {
            if (this.select_in_map) {

                let coordinates = this.coordinatesDelivery ? this.coordinatesDelivery : [55.76, 37.64]

                ymaps.ready(() => {
                    this.ymapSelectAddress = new ymaps.Map('map-select-address', {
                        center: coordinates,
                        zoom: 16,
                        type: 'yandex#map',
                        controls: ['zoomControl'],
                    }, {
                        searchControlProvider: 'yandex#search',
                        suppressMapOpenBlock: true,
                        zoomControlPosition: {
                            right: 32,
                            top: 32
                        },
                    });

                    this.placemark = new ymaps.Placemark(coordinates, {
                        balloonContent: ''
                    }, {
                        preset: 'islands#blueShoppingIcon',
                        iconColor: '#19beff',
                        draggable: true,
                    })

                    this.placemark.events.add('dragend', (e) => {
                        this.geoCodeCoordinates(e.get('target').geometry.getCoordinates())
                    })

                    this.ymapSelectAddress.geoObjects.add(this.placemark)
                });
            }
        },


        receipt_type() {
            if (this.receipt_type == 'pickup') {
                this.initStroreInMap()
                this.select_in_map = false
            }
        },

        need_cutter() {
            if (this.need_cutter) {
                window.scrollToTargetAdjusted({
                    elem: this.$el.querySelector('.cart__cutter'),
                    offset: 50
                })
            }
        }
    },

    filters: {
        convertWeight: function (value) {
            value = Number(value)

            if (value < 1) {
                return (value * 1000).toFixed(2) + ' г'; // Меньше 1 кг -> граммы
            } else if (value >= 1000) {
                return (value / 1000).toFixed(2) + ' т'; // Больше или равно 1000 кг -> тонны
            } else {
                return value.toFixed(2) + ' кг'; // Остальное -> килограммы
            }
        },
        numberWithSpaces: function (value) {
            if (!value) return '';
            value = Number(value).toFixed(2)
            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            return value
        },
    }
})


export {vueCheckout}

