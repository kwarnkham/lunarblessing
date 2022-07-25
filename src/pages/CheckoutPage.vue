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
      <div class="text-center q-mt-sm">
        <q-btn>Submit</q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { fasPhone, fasMobile } from "@quasar/extras/fontawesome-v6";
const checkoutForm = ref(null);
const name = ref("");
const mobile = ref("");
const address = ref("");
const submit = () => {};
</script>
