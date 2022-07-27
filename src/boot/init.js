import { LocalStorage } from "quasar";
import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";
import { useCartStore } from "src/stores/cart";
import { api } from "./axios";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ store }) => {
  if (api.defaults.headers.common["Authorization"]) {
    const userStore = useUserStore(store);
    const user = await api({
      method: "GET",
      url: "check-token",
    })
      .then(({ data }) => data)
      .catch((e) => {
        if (e.response.status == 401) {
          LocalStorage.remove("token");
          api.defaults.headers.common["Authorization"] = undefined;
        }
      });
    userStore.setUser(user);
  }

  const cartStore = useCartStore();
  cartStore.$onAction(({ after }) => {
    after((result) => {
      LocalStorage.set("cartItems", result);
    });
  });
});
