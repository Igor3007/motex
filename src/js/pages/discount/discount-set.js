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
  filters: {
    currency: function (x) {
      return parseFloat(x).toLocaleString("ru", {maximumFractionDigits: 2});
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
    inputQty(index, event) {
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
    changeQty(index, event) {
      let x = +event.target.value.replace(/\D/g, '');
      console.log(x);
    },
    buttonOff(event) {
      event.target
        .closest('.discount-good__combo-btn')
        .classList.toggle('active');
    },
    sendSingleItem(index) {
      const {id, qty} = this.products[index];
      if (!qty) {
        window.STATUS.wrn("Неверное количество");
        return;
      }
      const payload = {
        id, qty
      };
      this.toCart(payload, "Товар добавлен в корзину");
    },
    sendCollection() {
      const items = this.products
        .filter(item => item.qty > 0)
        .map(item => ({
          id: item.id,
          qty: item.qty,
        }));
      if (items.length > 0) {
        this.toCart(items, "Товары добавлены в корзину");
      } else {
        window.STATUS.wrn("Не выбран ни один товар");
      }
    },
    toCart(payload, successMsg) {
      fetch("#", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status !== 200) {
            window.STATUS.msg(successMsg);
          } else {
            window.STATUS.err(res.statusText);
          }
        })
        .catch(err => {
          console.log(err);
          window.STATUS.err('Извините, что-то пошло не так…');
        });
    }
  }
});
const el1 = document.querySelector('#discount-set-1');
if (el1) {
  new discountGoodsExt({propsData: {dataUrl: '/static/discount-2.json'}}).$mount(el1);
}

const el2 = document.querySelector('#discount-set-2');
if (el2) {
  new discountGoodsExt({propsData: {dataUrl: '/static/discount-2.json'}}).$mount(el2);
}
