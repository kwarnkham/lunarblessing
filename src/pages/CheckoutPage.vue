<template>
  <q-page padding class="flex flex-center">
    <q-form @submit.prevent="submit" ref="checkoutForm" class="full-width">
      <q-input :label="'Name'" outline dense v-model="name" required> </q-input>
      <q-input outline dense v-model="mobile" required type="tel">
        <template v-slot:prepend>
          <span class="text-caption">09-</span>
        </template>
        <template v-slot:before>
          <span class="text-caption">
            <q-icon :name="fasPhone" />
          </span>
        </template>
      </q-input>
      <q-input
        :label="'Address'"
        outline
        dense
        v-model="address"
        required
        type="textarea"
      ></q-input>
      <div class="q-mt-sm row justify-around">
        <q-btn v-if="getUser" push color="positive" no-caps type="submit">
          Make Order
        </q-btn>
        <q-btn @click="showLoginDialog" v-else no-caps>Login</q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { fasPhone } from "@quasar/extras/fontawesome-v6";
import { useQuasar } from "quasar";
import LoginDialog from "src/components/LoginDialog";
import { useUserStore } from "src/stores/user";
import useBackend from "src/composables/backend";
import { useCartStore } from "src/stores/cart";
import { useRouter } from "vue-router";
const checkoutForm = ref(null);
const { dialog } = useQuasar();
const name = ref("");
const mobile = ref("");
const address = ref("");
const { getItems, clearCart } = useCartStore();
const { setAddress } = useUserStore();
const router = useRouter();
const submit = () => {
  makeOrder({
    name: name.value,
    mobile: mobile.value,
    address: address.value,
    items: getItems,
  }).then((order) => {
    clearCart();
    if (!getUser.addresss) {
      setAddress(address.value);
    }

    router.push({
      name: "orderDetails",
      params: {
        id: order.id,
      },
    });
  });
};

const showLoginDialog = () => {
  dialog({
    component: LoginDialog,
  });
};
const { makeOrder } = useBackend();
const { getUser } = useUserStore();
onMounted(() => {
  if (getItems.length <= 0)
    router.replace({
      name: "lamp",
    });
  else if (getUser) {
    name.value = getUser.name;
    mobile.value = getUser.mobile;
    address.value = getUser.address;
  }
});
</script>
