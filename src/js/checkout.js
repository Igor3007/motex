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

                json: [],
                need_cutter: false,
                select_in_map: false,
                receipt_type: 'delivery',
                ymapSelectAddress: null,
                ymapStoreAddress: null

            },
            created: function () {
                //this.fetchData();
                window.loadApiYmaps(() => {
                    return false
                })
            },

            methods: {

            },

            computed: {
                productList: function () {
                    return this.json
                }
            },

            watch: {
                select_in_map() {
                    if (this.select_in_map) {
                        ymaps.ready(() => {
                            this.ymapSelectAddress = new ymaps.Map('map-select-address', {
                                center: [55.76, 37.64],
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