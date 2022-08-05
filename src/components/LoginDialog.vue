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
      <q-card-actions align="center" class="q-gutter-y-sm">
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
        <GoogleLoginButton :id="$options.__name" />
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
import { fabFacebook } from "@quasar/extras/fontawesome-v6";
import useFb from "src/composables/fb";
import useApp from "src/composables/app";
import GoogleLoginButton from "src/components/GoogleLoginButton";

const mobile = ref("");
const password = ref("");
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
const { dialog, localStorage, loading } = useQuasar();
const { successNotify } = useApp();
const showRegisterDialog = () => {
  onDialogCancel();
  dialog({
    component: RegisterDialog,
  }).onOk(() => {
    successNotify("Register success");
  });
};
const { login } = useBackend();
const userStore = useUserStore();
const submit = () => {
  loading.show();
  login({
    mobile: mobile.value,
    password: password.value,
  })
    .then(({ user, token }) => {
      localStorage.set("token", token);
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      userStore.setUser(user);
      onDialogOK();
    })
    .finally(() => {
      loading.hide();
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
