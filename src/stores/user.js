import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),

  getters: {
    getUser(state) {
      return state.user;
    },
  },

  actions: {
    setUser(payload) {
      this.user = payload;
      return this.user;
    },
    setAddress(payload) {
      this.user.address = payload;
      return this.user;
    },
    setName(payload) {
      this.user.name = payload;
      return this.user;
    },
    setMobile(payload) {
      this.user.mobile = payload;
      return this.user;
    },
  },
});
