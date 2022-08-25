<template>
  <div class="images text-center">
    <transition
      appear
      enter-active-class="animated rotateInDownLeft"
      leave-active-class="animated backOutDown"
      @after-enter="hideImage"
      @after-leave="showNextImage"
    >
      <q-img :src="currentImage" fit="contain" class="fit" v-if="showImage" />
    </transition>
  </div>
</template>

<script setup>
import useApp from "src/composables/app";
import { useItemsStore } from "src/stores/items";
import { computed, ref } from "vue";

const itemsStore = useItemsStore();
const { getImage } = useApp();
const currentImage = computed(() =>
  getImage(images.value[imageIndex.value].url)
);
const hideImage = () => {
  setTimeout(() => {
    showImage.value = false;
  }, 2000);
};
const showNextImage = () => {
  if (imageIndex.value + 1 < images.value.length) imageIndex.value++;
  else imageIndex.value = 0;
  showImage.value = true;
};
const showImage = ref(true);
const imageIndex = ref(0);
const images = computed(() =>
  [
    { url: "/asset/home-image-1.jpeg" },
    { url: "/asset/home-image-2.jpeg" },
    { url: "/asset/home-image-3.jpeg" },
    { url: "/asset/home-image-4.jpeg" },
  ].concat(
    itemsStore.getItems
      .map((item) => item.pictures[0])
      .filter((e) => e != undefined)
  )
);
</script>

<style scoped lang="scss">
.rotateInDownLeft {
  --animate-duration: 1s;
}
.backOutDown {
  --animate-duration: 1s;
}
.images {
  width: 100%;
  height: 300px;
}
</style>
