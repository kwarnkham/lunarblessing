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
        <q-btn v-if="token" push color="positive" no-caps type="submit">
          Make Order
        </q-btn>
        <q-btn @click="showLoginDialog" v-else no-caps>Login</q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { fasPhone } from "@quasar/extras/fontawesome-v6";
import { useQuasar } from "quasar";
import LoginDialog from "src/components/LoginDialog";
const checkoutForm = ref(null);
const { dialog, localStorage } = useQuasar();
const name = ref("");
const mobile = ref("");
const address = ref("");
const submit = () => {};
const token = localStorage.getItem("token");
const showLoginDialog = () => {
  dialog({
    component: LoginDialog,
  });
};
</script>
