<template>
  <q-page
    padding
    v-if="itemsStore.getItems.length"
    class="page text-grey-4"
    :style="{
      backgroundImage:
        'url(' + getImage('/asset/home-bg.jpeg') + ') !important',
    }"
  >
    <RunningZodiacSigns />
    <HomeImages />
    <div class="text-center q-mt-md">
      <q-btn
        no-caps
        glossy
        :label="'Browse More...'"
        color="primary"
        @click="$router.push({ name: 'lamp' })"
      />
    </div>
    <HomeContent />
  </q-page>
</template>

<script setup>
import useApp from "src/composables/app";
import RunningZodiacSigns from "src/components/RunningZodiacSigns";
import { useItemsStore } from "src/stores/items";
import HomeImages from "src/components/HomeImages.vue";
import HomeContent from "src/components/HomeContent.vue";

const itemsStore = useItemsStore();

const { getImage } = useApp();
</script>

<style lang="scss" scoped>
.page {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
