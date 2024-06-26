<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-center">
          <div>You are paying via {{ payment.name }}</div>
          <strong> {{ payment.number }}</strong>
          <q-btn
            @click="copyLinkToClipboard(payment.number)"
            :icon="fasCopy"
            flat
            round
            color="info"
          />
        </div>
        <q-separator />
        <div v-if="payment.account_name">
          The payment account name is "{{ payment.account_name }}"
        </div>
        <q-separator />
        <div class="text-center">
          <div>The Amount you need to pay is</div>
          <strong>{{ formatCurrency(amount) }} MMK</strong>
          <q-btn
            @click="copyLinkToClipboard(amount)"
            :icon="fasCopy"
            flat
            round
            color="info"
          />
        </div>
        <q-separator />
        <div class="text-center">
          Please upload the screenshot of the payment after you have paid
        </div>
        <q-form class="text-center" @submit.prevent="submit">
          <PicturesSelector v-model="selectedPictures">
            <template #showSelectedPictures="{ showPicturesToUpload }">
              <q-btn
                no-caps
                outline
                color="accent"
                :icon="fasEye"
                @click="showPicturesToUpload"
              />
            </template>
            <template #deleteSelectedPictures="{ clearChosenImages }">
              <q-btn
                no-caps
                outline
                color="negative"
                :icon="fasTrash"
                @click="clearChosenImages"
              />
            </template>
            <template #imagePicker="{ chooseImages }">
              <q-btn
                color="indigo"
                @click="chooseImages"
                no-caps
                :label="'Upload Payment Screenshot'"
              />
            </template>
            <!-- <template #upload>
          <q-btn color="primary" @click="upload" no-caps icon="upload" />
        </template> -->
          </PicturesSelector>
          <div class="text-center q-mt-sm">
            <q-btn
              :label="'Finish'"
              color="positive"
              no-caps
              type="submit"
              :disabled="selectedPictures.length <= 0"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :icon="fasXmark" no-caps flat @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import useUtility from "src/composables/utility";
import { computed, ref } from "vue";
import PicturesSelector from "./PicturesSelector.vue";
import {
  fasEye,
  fasTrash,
  fasXmark,
  fasCopy,
} from "@quasar/extras/fontawesome-v6";
import useBackend from "src/composables/backend";

const { copyLinkToClipboard, formatCurrency } = useUtility();
const selectedPictures = ref([]);
const { loading } = useQuasar();
const { pay } = useBackend();
const amount = computed(() =>
  props.order.items.reduce(
    (carry, item) => item.pivot.sale_price * item.pivot.quantity + carry,
    0
  )
);
const submit = () => {
  loading.show();
  pay(props.order, {
    screenshot: selectedPictures.value[0],
    payment_id: props.payment.id,
  })
    .then((data) => {
      if (data) onDialogOK(data);
    })
    .finally(() => {
      loading.hide();
    });
};
const props = defineProps({
  payment: {
    type: Object,
    required: true,
  },
  order: {
    type: Object,
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
// function onOKClick() {
//   // on OK, it is REQUIRED to
//   // call onDialogOK (with optional payload)
//   onDialogOK();
//   // or with payload: onDialogOK({ ... })
//   // ...and it will also hide the dialog automatically
// }
</script>
