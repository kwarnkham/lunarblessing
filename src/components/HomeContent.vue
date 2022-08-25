<template>
  <div class="text-center text-h5 text-weight-bolder">
    Hope you love the product of nature
  </div>
  <q-list>
    <q-item v-for="fact in facts" :key="fact.info">
      <q-item-section avatar>
        <q-icon :name="fact.icon" color="secondary" />
      </q-item-section>

      <q-item-section class="text-subtitle1">{{ fact.info }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import {
  fasAsterisk,
  fasClipboardList,
  fasLeaf,
} from "@quasar/extras/fontawesome-v6";
const facts = [
  {
    info: "Carefully crafted",
    icon: fasAsterisk,
  },
  {
    info: "Uniquely customizable",
    icon: fasClipboardList,
  },
  {
    info: "Made from local bamboo",
    icon: fasLeaf,
  },
];
</script>
