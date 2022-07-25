<template>
  <q-page padding>
    <div class="row justify-around q-gutter-y-xs">
      <q-btn
        :label="sign"
        v-for="sign in signs"
        :key="sign"
        push
        @click="selectedSign = sign"
        :color="selectedSign == sign ? 'primary' : 'grey-6'"
      />
    </div>

    <div v-if="selectedSign" class="full-width q-gutter-y-sm q-my-sm">
      <div class="bg-teal-2 rounded-borders">
        <q-img
          src="https://spaces.madewithheart.tech/assets/aquarius.png"
          class="fit"
          fit="contain"
        />
      </div>

      <div class="row justify-around">
        <q-btn
          :icon="fasLightbulb"
          color="primary"
          :flat="!switchedOn"
          :outline="switchedOn"
          @click="switchedOn = true"
          :disabled="switching"
        />
        <q-btn
          :icon="fasLightbulb"
          color="grey"
          :flat="switchedOn"
          :outline="!switchedOn"
          @click="switchedOn = false"
          :disabled="switching"
        />
      </div>
    </div>
    <q-input
      :label="'Custom quote'"
      outlined
      :placeholder="'Growing strong'"
      color="secondary"
      v-model="quote"
    >
      <template v-slot:append>
        <q-btn :icon="fasInfo" glossy size="xs" round color="info" />
      </template>
    </q-input>
    <div class="q-mt-sm rounded-borders dim-bright-radio">
      <div class="text-center">
        <q-btn :icon="fasInfo" glossy size="xs" round color="info" />
      </div>
      <div class="text-center">
        <q-radio :label="'Bright Lid'" v-model="brightLid" :val="true" />
        <q-radio :label="'Dimmed Lit'" v-model="brightLid" :val="false" />
      </div>
    </div>
    <div class="q-mt-sm">
      <q-btn :label="'It\'s done!'" no-caps color="positive" class="fit" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { fasLightbulb, fasInfo } from "@quasar/extras/fontawesome-v6";

const selectedSign = ref("aries");
const quote = ref("");
const brightLid = ref(true);
const switchedOn = ref(true);
const switching = ref(false);
const signs = [
  "aquarius",
  "pisces",
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
];
</script>

<style lang="scss" scoped>
.dim-bright-radio {
  border: solid $info 1px;
  padding-top: 6px;
}
</style>
