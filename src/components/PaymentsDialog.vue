<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="row justify-evenly q-gutter-xs">
        <q-btn
          v-for="payment in paymentStore.getPayments"
          :key="payment.id"
          :label="payment.name"
          no-caps
          push
          color="primary"
          @click="showPaymentForm(payment)"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { usePaymentStore } from "src/stores/payment";
import PaymentFormDialog from "./PaymentFormDialog";

const paymentStore = usePaymentStore();
const { dialog } = useQuasar();
const showPaymentForm = (payment) => {
  dialog({
    component: PaymentFormDialog,
    componentProps: {
      payment,
      amount: props.amount,
    },
  });
};

const props = defineProps({
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
