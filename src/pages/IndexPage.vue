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

    <div class="text-center q-mt-md">
      <q-btn
        no-caps
        glossy
        :label="'Browse More...'"
        color="primary"
        @click="$router.push({ name: 'lamp' })"
      />
    </div>
  </q-page>
</template>

<script setup>
import {
  fasAsterisk,
  fasClipboardList,
  fasLeaf,
} from "@quasar/extras/fontawesome-v6";
import { computed, ref } from "vue";
import { useItemsStore } from "src/stores/items";
import useApp from "src/composables/app";

const showImage = ref(true);
const imageIndex = ref(0);
const itemsStore = useItemsStore();
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
const signImages = computed(() =>
  itemsStore.getItems
    .map((item) => item.pictures[0])
    .filter((e) => e != undefined)
);
const currentImage = computed(() =>
  getImage(images.value[imageIndex.value].url)
);
const hideImage = () => {
  setTimeout(() => {
    showImage.value = false;
  }, 2000);
};
const { getImage } = useApp();
const showNextImage = () => {
  if (imageIndex.value + 1 < images.value.length) imageIndex.value++;
  else imageIndex.value = 0;
  showImage.value = true;
};

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

<style lang="scss" scoped>
.page {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.zoomIn,
.zoomOut {
  --animate-duration: 1s;
}
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
.top-marquee {
  filter: invert(100%);
  opacity: 0.5;
}
</style>
