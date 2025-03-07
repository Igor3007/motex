document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#vuecart')) {

        this.vueApp = new Vue({
            el: this.$el,
            data: {

                json: []

            },
        })

    }
});