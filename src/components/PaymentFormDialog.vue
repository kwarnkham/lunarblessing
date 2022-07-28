<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-center">
          <div>You are paying via {{ payment.name }}</div>
          <q-btn @click="copyLinkToClipboard(payment.number)">
            {{ payment.number }}
          </q-btn>
        </div>
        <q-separator />
        <div v-if="payment.account_name">
          The payment account name is "{{ payment.account_name }}"
        </div>
        <q-separator />
        <div class="text-center">
          <div>The Amount you need to pay is</div>
          <q-btn @click="copyLinkToClipboard(amount)"> {{ amount }} MMK </q-btn>
        </div>
        <q-separator />
        <div>
          Please upload the screenshot of the payment after you have paid
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { number } from "@intlify/core-base";
import { useDialogPluginComponent, useQuasar } from "quasar";
import useUtility from "src/composables/utility";
import { usePaymentStore } from "src/stores/payment";

const paymentStore = usePaymentStore();
const { dialog } = useQuasar();
const { copyLinkToClipboard } = useUtility();

const props = defineProps({
  payment: {
    type: Object,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
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
