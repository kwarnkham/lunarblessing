import { defineStore } from "pinia";
import { LocalStorage } from "quasar";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: LocalStorage.getItem("cartItems") || [],
  }),

  getters: {
    getItems(state) {
      return state.items;
    },
  },

  actions: {
    addItem(item) {
      if (this.items.length == 0) this.items.push(item);
      else {
        const index = this.items.findIndex((val) => val.id == item.id);
        if (index >= 0) {
          const cartItem = JSON.parse(JSON.stringify(this.items[index]));
          cartItem.quantity += item.quantity;
          this.items[index] = cartItem;
        } else this.items.push(item);
      }
      return this.items;
    },

    decreaseItem(item) {
      const index = this.items.findIndex((val) => val.id == item.id);
      if (index >= 0) {
        if (this.items[index].quantity > 1) this.items[index].quantity--;
        else this.items.splice(index, 1);
      }
      return this.items;
    },

    removeItem(item) {
      const index = this.items.find((val) => val.id == item.id);
      if (index >= 0) this.items.splice(index, 1);
      return this.items;
    },
    clearCart() {
      this.items = [];
      return [];
    },
  },
});
