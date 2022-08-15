<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-form @submit.prevent="submit">
          <q-input :label="'Name'" v-model="name" required> </q-input>
          <q-input
            :label="'Mobile'"
            v-model="mobile"
            required
            type="tel"
            prefix="09-"
          >
          </q-input>
          <q-input
            :label="'Password'"
            v-model="password"
            required
            type="password"
          >
          </q-input>
          <q-input
            :label="'Password Again'"
            v-model="passwordConfirm"
            required
            type="password"
          >
          </q-input>
          <div class="text-center q-mt-sm">
            <q-btn type="submit" :label="'Register'" color="primary" />
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="center" class="q-gutter-y-sm">
        <q-btn
          label="Friend ? Login here."
          @click="showLoginDialog"
          no-caps
          flat
        />
        <q-btn
          label="Login with"
          :icon-right="fabFacebook"
          @click="fbLogin"
          no-caps
          glossy
          rounded
          class="fb-color"
        />
        <GoogleLoginButton :id="$options.__name" />
        <div class="text-center full-width">
          <TelegramLoginButton />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { computed, ref, watch } from "vue";
import LoginDialog from "src/components/LoginDialog";
import useBackend from "src/composables/backend";
import { fabFacebook } from "@quasar/extras/fontawesome-v6";
import useFb from "src/composables/fb";
import useApp from "src/composables/app";
import GoogleLoginButton from "src/components/GoogleLoginButton";
import { useUserStore } from "src/stores/user.js";
import TelegramLoginButton from "./TelegramLoginButton";

const mobile = ref("");
const name = ref("");
const password = ref("");
const passwordConfirm = ref("");
const { dialog, loading } = useQuasar();
const { successNotify, preserveToken } = useApp();
const showLoginDialog = () => {
  onDialogHide();
  dialog({
    component: LoginDialog,
  }).onOk(() => {
    successNotify("Login success");
  });
};
const { register } = useBackend();
const userStore = useUserStore();
const user = computed(() => userStore.getUser);
watch(user, (newValue, oldValue) => {
  if (oldValue == null && newValue.id != undefined) onDialogHide();
});
const { loginWithFb } = useFb();
const fbLogin = () => {
  loading.show();
  loginWithFb()
    .then((_) => {
      onDialogOK();
    })
    .finally(() => {
      loading.hide();
    });
};

const submit = () => {
  loading.show();
  register({
    name: name.value,
    mobile: mobile.value,
    password: password.value,
    password_confirmation: passwordConfirm.value,
  })
    .then((data) => {
      preserveToken(data);
      onDialogOK();
    })
    .finally(() => {
      loading.hide();
    });
};
// const props = defineProps({
//   // ...your custom props
// });

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
// function onOKClick() {
//   // on OK, it is REQUIRED to
//   // call onDialogOK (with optional payload)
//   onDialogOK();
//   // or with payload: onDialogOK({ ... })
//   // ...and it will also hide the dialog automatically
// }
</script>
