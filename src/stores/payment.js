import { defineStore } from "pinia";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    payments: [],
  }),

  getters: {
    getPayments(state) {
      return state.payments;
    },
  },

  actions: {
    setPayments(payload) {
      this.payments = payload;
    },
  },
});
