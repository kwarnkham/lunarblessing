import { LocalStorage } from "quasar";
import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";
import { useCartStore } from "src/stores/cart";
import { api } from "./axios";
import { usePaymentStore } from "src/stores/payment";
import { useItemsStore } from "src/stores/items";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ store, router }) => {
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
          router.replace({ name: "index" });
        }
      });
    userStore.setUser(user);
  }

  const payments = await api({
    method: "GET",
    url: "payment",
    params: {
      active: 1,
    },
  }).then(({ data }) => data);
  const paymentStore = usePaymentStore();
  paymentStore.setPayments(payments);

  const items = await api({
    method: "GET",
    url: "/item",
  }).then(({ data }) => data.data);
  const itemsStore = useItemsStore();
  itemsStore.setItems(items);

  const cartStore = useCartStore();
  cartStore.$onAction(({ after }) => {
    after((result) => {
      LocalStorage.set("cartItems", result);
    });
  });
});
