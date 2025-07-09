import Vue from "vue/dist/vue.esm.js";

const discountGoods = new Vue({
  el: "#discount-goods-vue",
  data: {
    json: {}
  },
  created: function () {
    this.fetchData();
  },
  computed: {
    products: function () {
      return this.json?.products;
    }
  },
  methods: {
    fetchData() {
      fetch('/static/discount.json')
        .then(res => res.json())
        .then(data => {
          this.json = data;
        })
    }
  }
});

export {discountGoods};
