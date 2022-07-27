<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-form @submit.prevent="submit">
          <q-input :label="'Mobile'" v-model="mobile" required> </q-input>
          <q-input
            :label="'Password'"
            v-model="password"
            required
            type="password"
          >
          </q-input>
          <div class="text-center q-mt-sm">
            <q-btn type="submit" :label="'Login'" color="primary" no-caps />
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="New guy? Register here."
          @click="showRegisterDialog"
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
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref } from "vue";
import RegisterDialog from "src/components/RegisterDialog";
import useBackend from "src/composables/backend";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { fasCheck, fabFacebook } from "@quasar/extras/fontawesome-v6";
import useFb from "src/composables/fb";

const mobile = ref("");
const password = ref("");
const { loginWithFb } = useFb();
const fbLogin = () => {
  loginWithFb().then((_) => {
    onDialogOK();
  });
};
const { dialog, localStorage, notify } = useQuasar();
const showRegisterDialog = () => {
  onDialogCancel();
  dialog({
    component: RegisterDialog,
  }).onOk(() => {
    notify({
      message: "Register success",
      type: "positive",
      icon: fasCheck,
    });
  });
};
const { login } = useBackend();
const userStore = useUserStore();
const submit = () => {
  login({
    mobile: mobile.value,
    password: password.value,
  }).then(({ user, token }) => {
    localStorage.set("token", token);
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
    userStore.setUser(user);
    onDialogOK();
  });
};
const props = defineProps({
  // ...your custom props
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
