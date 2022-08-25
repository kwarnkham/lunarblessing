<template>
  <div
    class="text-subtitle2 text-center row justify-around h-30 overflow-hidden top-marquee"
  >
    <div class="row fit no-wrap marquee">
      <div v-for="image in signImages" :key="image.id" class="col-1">
        <q-icon :name="'img:' + getImage(image.url)" size="sm" />
      </div>
      <div v-for="image in signImages" :key="image.name" class="col-1">
        <q-icon :name="'img:' + getImage(image.url)" size="sm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import useApp from "src/composables/app";
import { useItemsStore } from "src/stores/items";
import { computed } from "vue";

const itemsStore = useItemsStore();
const { getImage } = useApp();
const signImages = computed(() =>
  itemsStore.getItems
    .map((item) => item.pictures[0])
    .filter((e) => e != undefined)
);
</script>

<style scoped lang="scss"></style>
