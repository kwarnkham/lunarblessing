import { defineStore } from "pinia";

export const useItemsStore = defineStore("items", {
  state: () => ({
    items: [],
  }),

  getters: {
    getItems(state) {
      return state.items;
    },
  },

  actions: {
    setItems(payload) {
      this.items = payload;
    },
  },
});
