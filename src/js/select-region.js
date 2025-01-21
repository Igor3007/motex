document.addEventListener('DOMContentLoaded', function (event) {

    class SelectRegion {
        constructor(params) {
            this.html = params.html
            this.vueApp = null;
            this.$el = null
            this.init()
        }

        init() {
            this.$el = document.createElement('div')
            this.$el.innerHTML = this.html
            document.body.append(this.$el)

            this.startVue()
        }

        startVue() {
            this.vueApp = new Vue({
                el: this.$el,
                data: {
                    message: 'Hello Vue!',
                    cityArray: [],
                    listCity: [],
                    searchInput: ''
                },

                mounted: function () {
                    this.getCityJSON()
                },

                methods: {
                    getCityJSON: function () {
                        let query = fetch('/static/cities.json', {
                            method: 'GET',
                        })

                        query
                            .then((response => response.json()))
                            .then((data) => {
                                this.cityArray = data
                            })
                    },


                },

                computed: {
                    getArrayCity: function () {
                        var complexArr = {};
                        var firstLetter = '';
                        var res = null

                        this.cityArray.sort(function (a, b) {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            // если имена равны
                            return 0;
                        });

                        if (this.searchInput.length > 1) {
                            res = this.cityArray.filter(item => {
                                return item.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) !== -1
                            })

                            // res.sort((a, b) => {
                            //     const startsWithM_a = a.toLowerCase().startsWith(this.searchInput.toLowerCase().substr(0, 1));
                            //     const startsWithM_b = b.toLowerCase().startsWith(this.searchInput.toLowerCase().substr(0, 1));

                            //     if (startsWithM_a && !startsWithM_b) {
                            //         return -1;
                            //     }
                            //     if (!startsWithM_a && startsWithM_b) {
                            //         return 1;
                            //     }
                            //     return a.localeCompare(b);
                            // });

                        } else {
                            res = this.cityArray
                        }

                        res.forEach((item, index) => {

                            firstLetter = String(item.name).charAt(0)

                            if (typeof complexArr[firstLetter] === 'undefined') {

                                complexArr[firstLetter] = {
                                    letter: firstLetter,
                                    name: item.name,
                                    data: new Set(),
                                    city: [{
                                        name: item.name,
                                        count: 1
                                    }]
                                }

                                complexArr[firstLetter]['data'].add(item.name)

                            } else {
                                complexArr[firstLetter]['data'].add(item.name)

                                if (typeof complexArr[firstLetter]['city'].find(c => c.name == item.name) === 'undefined') {
                                    complexArr[firstLetter]['city'].push({
                                        name: item.name,
                                        count: 1
                                    })
                                } else {
                                    complexArr[firstLetter]['city'].find(c => c.name == item.name).count++
                                }

                            }
                        })

                        return complexArr;
                    }
                }
            })
        }
    }

    document.querySelectorAll('[data-region-select="open"]').forEach(item => {
        item.addEventListener('click', () => {
            let query = fetch('/_popup-select-region.html', {
                method: 'GET',
            })

            query
                .then((response) => response.text())
                .then((html) => {
                    window.SelectRegion = new SelectRegion({
                        html
                    })
                })

        })
    })
});