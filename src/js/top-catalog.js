document.addEventListener('DOMContentLoaded', function (event) {

    class TopCatalog {
        constructor(params) {
            this.html = params.html;
            this.button = params.button
            this.vueApp = null;
            this.$el = null;
            this.init();
        }

        init() {
            this.$el = document.createElement('div');
            this.$el.innerHTML = this.html;
            document.body.append(this.$el);

            this.startVue();

        }

        startVue() {

            let btn = this.button

            this.vueApp = new Vue({
                el: this.$el,
                data: {
                    isOpen: false,
                    isOpenPane: false,
                    dataJSON: [],
                    activeCat: 0,
                    isMobile: document.body.clientWidth <= 768
                },

                mounted: function () {
                    this.getCatalogJSON();
                    this.isPageHidden();

                    window.addEventListener('resize', () => {
                        this.isMobile = document.body.clientWidth <= 768
                    })

                    document.addEventListener('click', e => {
                        if (!e.target.closest('.section-top-catalog, [data-target="topcatalog"]')) {
                            this.closePopup()
                        }
                    })
                },

                methods: {
                    getCatalogJSON: function () {
                        let query = fetch('/static/top-catalog.json', {
                            method: 'GET',
                        });

                        query
                            .then((response) => response.json())
                            .then((data) => {
                                this.dataJSON = data;
                            });
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

                    closePopup() {
                        this.isOpen = false;
                        document.body.classList.toggle('page-hidden', false);
                        btn.classList.toggle('is-active', false);
                        this.isOpenPane = false
                    },

                    openPopup() {
                        this.isOpen = !this.isOpen;
                        document.body.classList.toggle('page-hidden', this.isOpen && this.isMobile);
                        btn.classList.toggle('is-active', this.isOpen);

                        window.scrollTo({
                            top: 0
                        })
                    },

                    isPageHidden() {
                        document.body.classList.toggle('page-hidden', this.isOpen && this.isMobile);
                    },

                    showHideList(e) {
                        e.target.closest('.card-subcat__list').classList.toggle('is-hide');
                    },

                    hoverNav(i) {
                        if (!this.isMobile) this.activeCat = i;
                    },

                    clickNav(i) {
                        if (this.isMobile) {
                            this.activeCat = i;
                            this.isOpenPane = true;
                        }
                    }
                },

                computed: {
                    listcatalog() {
                        return this.dataJSON;
                    },

                    subCat() {
                        return this.dataJSON.length ? this.listcatalog[this.activeCat] : [];
                    },

                    listSubCat() {
                        return this.dataJSON.length ? this.listcatalog[this.activeCat].sub : [];
                    },


                },

                watch: {
                    'activeCat': function () {
                        this.$refs.elsubcat.scrollTop = 0
                    }
                }
            });
        }
    }

    document.querySelectorAll('[data-target="topcatalog"]').forEach(item => {
        item.addEventListener('click', () => {
            if (!window.TopCatalog) {
                let query = fetch('/pages/_popup-top-catalog.html', {
                    method: 'GET',
                });

                query
                    .then((response) => response.text())
                    .then((html) => {
                        window.TopCatalog = new TopCatalog({
                            html,
                            button: item
                        });
                        window.TopCatalog.vueApp.openPopup();
                    });
            } else {
                window.TopCatalog.vueApp.openPopup();
            }
             
        });
    });
});