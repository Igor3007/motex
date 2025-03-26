document.addEventListener('DOMContentLoaded', function (event) {

    const API_YMAPS = 'https://api-maps.yandex.ru/2.1/?apikey=0e2d85e0-7f40-4425-aab6-ff6d922bb371&suggest_apikey=ad5015b5-5f39-4ba3-9731-a83afcecb740&lang=ru_RU&mode=debug';

    window.loadApiYmaps = function (callback) {

        if (window.ymaps == undefined) {
            const script = document.createElement('script')
            script.src = API_YMAPS
            script.onload = () => {
                callback(window.ymaps)
            }
            document.head.append(script)
        } else {
            callback(window.ymaps)
        }

    }

    if (document.querySelector('#vuecheckout')) {

        let vueApp = new Vue({
            el: '#vuecheckout',
            data: {

                products: [],
                timer: null,
                need_cutter: false,
                select_in_map: false,
                receipt_type: 'delivery',
                ymapSelectAddress: null,
                placemark: null,
                ymapStoreAddress: null,
                suggestArray: [],
                isOpenSuggest: false,
                addressDelivery: null,
                coordinatesDelivery: null,
                fileArray: [],

            },
            created: function () {
                this.fetchData();
                window.loadApiYmaps(() => {
                    return false
                })
            },

            methods: {

                fetchData() {
                    fetch('/static/cart.json', {
                            method: 'GET',
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            this.products = data.products
                        })
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
            },

            computed: {
                productList: function () {
                    return this.json
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
                                balloonContent: 'Челябинск, Троицкий Тракт, д. 17'
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
                    }
                }
            }
        })

    }
});