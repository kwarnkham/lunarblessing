import { defineStore } from "pinia";

export const useCounterStore = defineStore("cart", {
  state: () => ({
    items: [],
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
        const index = this.items.find((val) => val.id == item.id);
        if (index >= 0) this.items[index].quantity++;
        else this.items.push(item);
      }
    },

    decreaseItem(item) {
      const index = this.items.find((val) => val.id == item.id);
      if (index >= 0) {
        if (this.items[index].quantity > 1) this.items[index].quantity--;
        else this.items.splice(index, 1);
      }
    },

    removeItem(item) {
      const index = this.items.find((val) => val.id == item.id);
      if (index >= 0) this.items.splice(index, 1);
    },
  },
});
