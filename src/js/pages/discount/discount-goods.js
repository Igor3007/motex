import Vue from "vue/dist/vue.esm.js";

const discountGoodsExt = Vue.extend({
  data: () => ({
    json: {}
  }),
  props: ['dataUrl'],
  created: function () {
    this.fetchData();
  },
  computed: {
    products: function () {
      return this.json?.products;
    },
    totalPrice: function () {
      return this.products.reduce((total, product) => (total + product.price.new * product.qty), 0);
    },
    totalOld: function () {
      return this.products.reduce((total, product) => (total + product.price.old * product.qty), 0);
    },
    totalDiscount: function () {
      return Math.round(100 * ((1 - (this.totalPrice / this.totalOld)) || 0));
    }
  },

  methods: {
    fetchData() {
      fetch(this.dataUrl)
        .then(res => res.json())
        .then(data => {
          this.json = {
            ...data,
            products: data.products.map(product => ({
              ...product,
              qty: 0
            }))
          };
        })
    },
    increaseQty(index) {
      const x = +this.json.products[index].qty + 1;
      if (x < 999) {
        this.json.products[index].qty = x;
      }
    },
    decreaseQty(index) {
      const x = +this.json.products[index].qty - 1;
      if (x >= 0) {
        this.json.products[index].qty = x;
      }
    },
    changeQty(index, event) {
      let x = +event.target.value.replace(/\D/g, '');
      if (x > 999) {
        x = 999
      }
      if (x < 0) {
        x = 0
      }
      event.target.value = x;
      this.json.products[index].qty = x;
    },
    buttonOff(event) {
      event.target
        .closest('.discount-good__combo-btn')
        .classList.toggle('active');
    }
  }
});
new discountGoodsExt({propsData: {dataUrl: '/static/discount.json'}}).$mount('#discount-goods-1');
new discountGoodsExt({propsData: {dataUrl: '/static/discount-2.json'}}).$mount('#discount-goods-2');
