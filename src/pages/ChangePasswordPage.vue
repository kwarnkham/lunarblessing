<template>
  <q-page padding class="flex flex-center">
    <q-form
      @submit.prevent="submit"
      class="full-width"
      v-if="canChangePassword"
    >
      <div class="text-h6 text-center">Change Password</div>
      <q-input
        :label="'Current Password'"
        v-model="current"
        required
        type="password"
      >
      </q-input>
      <q-input
        :label="'New Password'"
        v-model="password"
        required
        type="password"
      >
      </q-input>
      <q-input
        :label="'New Password Again'"
        v-model="passwordAgain"
        required
        type="password"
      >
      </q-input>
      <div class="text-center q-mt-sm">
        <q-btn type="submit" :label="'Change'" color="primary" />
      </div>
    </q-form>
    <div v-else class="text-center text-subtitle1">
      You don't have or need a password to login. You can login via Facebook.
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import useBackend from "src/composables/backend";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";

const { loading } = useQuasar();
const userStore = useUserStore();
const current = ref("");
const password = ref("");
const passwordAgain = ref("");
const { changePassword } = useBackend();
const { successNotify } = useApp();
const canChangePassword =
  !userStore.getUser.fb_login_id &&
  !userStore.getUser.email &&
  !userStore.getUser.telegram_id;
const submit = () => {
  loading.show();
  changePassword({
    current_password: current.value,
    password: password.value,
    password_confirmation: passwordAgain.value,
  })
    .then((response) => {
      if (response) {
        successNotify("Success");
        current.value = "";
        password.value = "";
        passwordAgain.value = "";
      }
    })
    .finally(() => {
      loading.hide();
    });
};
</script>
