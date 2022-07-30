<template>
  <q-page padding class="flex flex-center">
    <q-form @submit.prevent="submit" class="full-width">
      <q-input :label="'Name'" v-model="name" required> </q-input>
      <q-input :label="'Mobile'" v-model="mobile" required> </q-input>
      <q-input :label="'Address'" v-model="address" required type="textarea">
      </q-input>
      <div class="text-center q-mt-sm">
        <q-btn type="submit" :label="'Update'" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import useBackend from "src/composables/backend";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";

const userStore = useUserStore();
const { loading } = useQuasar();
const name = ref(userStore.getUser.name);
const mobile = ref(userStore.getUser.mobile);
const address = ref(userStore.getUser.address);
const { updateUser } = useBackend();
const { successNotify } = useApp();
const submit = () => {
  loading.show();
  updateUser({
    name: name.value,
    mobile: mobile.value,
    address: address.value,
  })
    .then((user) => {
      if (user) {
        userStore.setUser(user);
        successNotify("Updated");
      }
    })
    .finally(() => {
      loading.hide();
    });
};
</script>
