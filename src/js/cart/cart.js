document.addEventListener('DOMContentLoaded', function (event) {



    if (document.querySelector('#vuecart')) {

        let vueApp = new Vue({
            el: '#vuecart',
            data: {
                config: {
                    timer: 10000
                },
                json: [],
                isPageLoading: true,
                need_cutter: false,
                cutter_desc: '',
                isOpenSaleDropdown: false,
                discounts: [],
                promocode: '',
                isLoadPromodode: false,
                isLoadOrder: false,
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
                    value = Number(value).toFixed(2)
                    value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    return value
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

                            data.products.forEach(item => {
                                item['timer'] = false;
                                item['interval'] = false;
                                item['timerMS'] = Number(this.config.timer);
                            })

                            this.json = data.products
                            this.pricelist = data.services
                            this.getPromotion()
                            this.isPageLoading = false
                        })
                },

                sendOrder() {
                    let formData = new FormData()

                    formData.append('products', JSON.stringify(this.json))
                    formData.append('weight', this.$options.filters.convertWeight(this.getTotalWeight))
                    formData.append('discounts', JSON.stringify(this.discounts))
                    formData.append('discountsCost', this.$options.filters.numberWithSpaces(this.getTotalDiscount))
                    formData.append('totalPrice', this.$options.filters.numberWithSpaces(this.getTotalPriceOrder))
                     

                    if(this.need_cutter) {
                         let data = [
                            {
                                services: 'Нужен распил',
                                services_desc: this.cutter_desc
                            }
                         ]

                         formData.append('services', JSON.stringify(data))
                    }

                    if(this.fileArray.length) {
                        this.fileArray.forEach(file => {
                            formData.append('files[]', file)
                        })
                    }

                    console.log(formData)

                    let xhr = new XMLHttpRequest();

                    // отслеживаем процесс отправки
                    xhr.upload.onprogress = function(event) {
                      console.log(`Отправлено ${event.loaded} из ${event.total}`);
                    };
                  
                    // Ждём завершения: неважно, успешного или нет
                    xhr.onloadend = function() {
                      if (xhr.status == 200) {
                        console.log("Успех");
                      } else {
                        console.log("Ошибка " + this.status);
                      }
                    };
                  
                    xhr.open("POST", "/article/xmlhttprequest/post/upload");
                    xhr.send(formData);

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

                    //if (total == 0 && total <= 1) total = 1
                    if (total > 999) total = 999

                    if (total) {
                        this.json[index].total = total;
                    }


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

                declination: function (value, words) {
                    value = Number(value);
                    value = Math.abs(value) % 100;
                    var num = value % 10;
                    if (value > 10 && value < 20) return words[2];
                    if (num > 1 && num < 5) return words[1];
                    if (num == 1) return words[0];
                    return words[2];
                },

                toggleDotsMenu(event) {
                    event.target.closest('.dots-menu').classList.toggle('is-open')
                    const clickOnOut = (e) => {
                        if(!e.target.closest('.dots-menu')){
                            event.target.closest('.dots-menu').classList.toggle('is-open', false)
                            document.removeEventListener('click', clickOnOut)
                        }
                    }

                    document.addEventListener('click', clickOnOut)
                },

                addPromocode() {
                    if (this.promocode) {

                        if (this.discounts.find(item => item.name == this.promocode) || this.isLoadPromodode) {
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
                                    this.isLoadPromodode = false;
                                    this.isOpenSaleDropdown = true;
                                    this.discounts.push({
                                        name: this.promocode,
                                        sale: 2500,
                                    })
                                    this.promocode = ''
                                }
                            }) */

                        setTimeout(() => {

                            this.isLoadPromodode = false;
                            this.isOpenSaleDropdown = true;
                            this.discounts.push({
                                name: this.promocode,
                                sale: 2500,
                            })
                            this.promocode = ''
                        }, 2000)
                    }
                },

                removeSelected() {
                    if (confirm('Удалить выбранныые товары?')) {

                        for (let i = this.json.length - 1; i >= 0; i--) {
                            if (this.removeList.includes(i)) {
                                this.removeItem(i, this.json[i])
                            }
                        }

                        this.removeList = []
                        this.isSelectAllCheckbox = false
                    }
                },

                removeItem(index, item) {

                    const removeQuery = (item) => {
                        /* fetch('/endpoint', {
                                method: 'POST',
                                body: JSON.stringify({id: item.id}),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.status) console.log('product remove success')
                            }) */
                    }

                    item['timer'] = setTimeout(() => {
                        clearTimeout(item.timer)
                        clearTimeout(item.interval)

                        this.json.forEach((el, i) => {
                            if (el.id == item.id) {
                                this.json.splice(i, 1);
                                removeQuery(item)
                            }
                        })

                    }, this.config.timer)

                    item['interval'] = setInterval(() => {
                        item['timerMS'] -= 1000
                    }, 1000)

                },

                revertRemoveProduct(id) {
                    this.json.forEach((item, index) => {
                        if (item.id == id) {
                            clearTimeout(this.json[index].timer)
                            clearTimeout(this.json[index].interval)
                            this.json[index].timer = false
                            this.json[index].timerMS = this.config.timer
                        }
                    })
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

                removeAttachFile(i) {
                    this.fileArray.splice(i, 1);
                },

                openPopupPrice() {
                    this.$refs.popup.open()
                },

                openPopupOneClick() {
                    this.$refs.oneclick.open()
                },

                product_towishlist(index, product) {

                    let data = {
                        id: product.id
                    }

                    this.json[index]['wishlist'] = !this.json[index]['wishlist']

                    /* fetch('/endpoint', {
                                method: 'POST',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                 
                                if(data.status) {
                                   this.json[index]['wishlist'] = true
                                }else{
                                   this.json[index]['wishlist'] = false
                                }
                            }) */
                },

                formatMillisecondsToMMSS(ms) {
                    const milliseconds = Number(ms);
                    const totalSeconds = Math.floor(milliseconds / 1000);
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    const formattedMinutes = String(minutes).padStart(2, '0');
                    const formattedSeconds = String(seconds).padStart(2, '0');
                    return `${formattedMinutes}:${formattedSeconds}`;
                },

                addPromocodeOnEnter(e) {
                    if (e.code == 'Enter') this.addPromocode()
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

                    let total = Number(this.getCostProducts - this.getTotalDiscount).toFixed(2)

                    return total > 0 ? total : '0'
                },


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
                },

                need_cutter() {
                    if (this.need_cutter) {
                        window.scrollToTargetAdjusted({
                            elem: this.$el.querySelector('.cart__cutter'),
                            offset: window.globalConfig.hgtheader
                        })
                    }
                }


            }
        })

    }
});