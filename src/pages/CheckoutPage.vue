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
        <q-btn v-if="user" push color="positive" no-caps type="submit">
          Make Order
        </q-btn>
        <div v-else class="row justify-around full-width">
          <q-btn @click="showLoginDialog" no-caps>Login</q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { fasPhone } from "@quasar/extras/fontawesome-v6";
import { useUserStore } from "src/stores/user";
import useBackend from "src/composables/backend";
import { useCartStore } from "src/stores/cart";
import { useRouter } from "vue-router";
import useApp from "src/composables/app";
import { useQuasar } from "quasar";

const checkoutForm = ref(null);
const name = ref("");
const mobile = ref("");
const address = ref("");
const cartStore = useCartStore();
const userStore = useUserStore();
const router = useRouter();
const { loading } = useQuasar();
const submit = () => {
  loading.show();
  makeOrder({
    name: name.value,
    mobile: mobile.value,
    address: address.value,
    items: cartStore.getItems,
  })
    .then((order) => {
      cartStore.clearCart();
      if (!user.value.addresss) userStore.setAddress(address.value);
      if (!user.value.name) userStore.setName(name.value);
      if (!user.value.mobile) userStore.setMobile(mobile.value);

      router.push({
        name: "orderDetails",
        params: {
          id: order.id,
        },
      });
    })
    .finally(() => {
      loading.hide();
    });
};

const { showLoginDialog } = useApp();
const { makeOrder } = useBackend();
const user = computed(() => userStore.getUser);
const fillForm = () => {
  if (user.value.name) name.value = user.value.name;
  if (user.value.mobile) mobile.value = user.value.mobile;
  if (user.value.address) address.value = user.value.address;
};

watch(user, (data) => {
  if (data) {
    fillForm();
  }
});
onMounted(() => {
  if (cartStore.getItems.length <= 0)
    router.replace({
      name: "lamp",
    });
  else if (user.value) fillForm();
});
</script>
