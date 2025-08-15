import Vue from "vue/dist/vue.esm.js";

const discountGoodsExt = Vue.extend({
  data: () => ({
    json: {},
    saveTimeout: []
  }),
  props: ['dataUrl'],
  created: function () {
    this.fetchData();
  },
  computed: {
    products: function () {
      return this.json?.products;
    },
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
    increaseQty(index, save = false) {
      const x = +this.json.products[index].qty + 1;
      if (x < 999) {
        this.json.products[index].qty = x;
      }
      if (save) this.saveQty(index);
    },
    decreaseQty(index, save = false) {
      const x = +this.json.products[index].qty - 1;
      if (x >= 0) {
        this.json.products[index].qty = x;
      }
      if (save) this.saveQty(index);
    },
    inputQty(index, event, save = false) {
      let x = +event.target.value.replace(/\D/g, '');
      if (x > 999) {
        x = 999
      }
      if (x < 0) {
        x = 0
      }
      event.target.value = x;
      this.json.products[index].qty = x;
      if (save) this.saveQty(index);
    },
    saveQty(index) {
      if (this.saveTimeout[index]) clearTimeout(this.saveTimeout[index]);
      this.saveTimeout[index] = setTimeout(() => {
        this.sendSingleItem(index);
      }, 1000);
    }
    ,
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
    toCart(payload, successMsg) {
      fetch("#", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 200) {
            window.STATUS.msg(successMsg);
          } else {
            window.STATUS.err(res.statusText || "Ошибка при добавлении товара в корзину");
          }
        })
        .catch(err => {
          console.log(err);
          window.STATUS.err('Извините, что-то пошло не так…');
        });
    }
  }
});
const el1 = document.querySelector('#discount-item-1');
if (el1) {
  new discountGoodsExt({propsData: {dataUrl: '/static/discount.json'}}).$mount(el1);
}

const el2 = document.querySelector('#discount-item-2');
if (el2) {
  new discountGoodsExt({propsData: {dataUrl: '/static/discount.json'}}).$mount(el2);
}
