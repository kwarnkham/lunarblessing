<template>
  <q-page padding v-if="itemStore.getItems.length" class="page">
    <div class="row justify-around q-gutter-y-xs">
      <q-btn
        :label="item.name"
        v-for="item in itemStore.getItems"
        :key="item.id"
        push
        @click="selectedItem = item"
        :color="selectedItem.id == item.id ? 'primary' : 'grey-6'"
        dense
        no-caps
      />
    </div>

    <div v-if="selectedItem" class="full-width q-gutter-y-sm q-my-sm">
      <div class="bg-black rounded-borders image relative-position">
        <div
          :class="[switchedOn ? 'animation-fade-on' : 'animation-fade-off']"
        ></div>
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
        <q-btn :icon="fasImage" color="info" flat @click="showAllPictures" />
      </div>
    </div>
    <q-input
      :label="'Custom quote (Optional)'"
      outlined
      :placeholder="'Growing strong'"
      color="secondary"
      v-model="quote"
      no-error-icon
      counter
      type="textarea"
      :rules="[
        (val) =>
          val == '' ? true : val.length <= 60 || 'Keep it a bit shorter please',
      ]"
    >
      <template v-slot:append>
        <q-btn
          :icon="fasInfo"
          glossy
          size="xs"
          round
          color="info"
          @click="explainEngrave"
        />
      </template>
    </q-input>
    <div class="q-mt-sm rounded-borders dim-bright-radio">
      <div class="text-center">
        <q-btn
          :icon="fasInfo"
          glossy
          size="xs"
          round
          color="info"
          @click="explainDimmedLid"
        />
      </div>
      <div class="text-center">
        <q-radio :label="'Bright Lid'" v-model="dimmedLid" :val="true" />
        <q-radio :label="'Dimmed Lid'" v-model="dimmedLid" :val="false" />
      </div>
    </div>
    <div class="q-mt-sm">
      <q-btn
        :label="'Done!'"
        no-caps
        color="positive"
        class="fit"
        @click="addToCart"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { fasLightbulb, fasInfo, fasImage } from "@quasar/extras/fontawesome-v6";
import { useCartStore } from "src/stores/cart";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import useApp from "src/composables/app";
import PictureDialog from "src/components/PictureDialog";
import { useItemsStore } from "src/stores/items";

const quote = ref("");
const dimmedLid = ref(true);
const switchedOn = ref(true);
const switching = ref(false);
const cartStore = useCartStore();
const { dialog } = useQuasar();
const router = useRouter();
const { getItemImage } = useApp();

const itemStore = useItemsStore();
const selectedItem = ref(itemStore.getItems[0]);
const explainEngrave = () => {
  dialog({
    component: PictureDialog,
    componentProps: {
      src: "https://spaces.madewithheart.tech/lunarblessing_dev/asset/aries.png",
      text: "We engrave the text you provided to the lamp. It's optional.",
    },
  });
};
const explainDimmedLid = () => {
  dialog({
    component: PictureDialog,
    componentProps: {
      src: "https://spaces.madewithheart.tech/lunarblessing_dev/asset/aries.png",
      text: "You might want to choose dimmed lid if you don't want bright light from the top(lid)",
    },
  });
};

const addToCart = () => {
  dialog({
    title: "Adding to cart",
    prompt: {
      model: 1,
      label: "How many quantity you want?",
      type: "tel",
      isValid: (val) => !isNaN(Number(val) || "Please only type number"),
    },
  }).onOk((quantity) => {
    selectedItem.value.text = quote.value;
    selectedItem.value.dimmed_lid = dimmedLid.value;
    selectedItem.value.quantity = quantity;
    cartStore.addItem(selectedItem.value);
    dialog({
      title: "Check the cart now?",
      persistent: true,
      cancel: {
        label: "Keep shopping",
        noCaps: true,
        flat: true,
      },
    }).onOk(() => {
      router.push({
        name: "cart",
      });
    });
  });
};
const showAllPictures = () => {};
</script>

<style lang="scss" scoped>
.dim-bright-radio {
  border: solid $info 1px;
  padding-top: 6px;
}
</style>

<style scoped lang="scss">
.page {
  --onimage: url(https://spaces.madewithheart.tech/lunarblessing/items/aries-on.jpeg);
  --offimage: url(https://spaces.madewithheart.tech/lunarblessing/items/aries-off.jpeg);
}
@keyframes fadeOn {
  0% {
    background-image: var(--offimage);
  }
  100% {
    background-image: var(--onimage);
  }
}
.animation-fade-on {
  background-image: var(--onimage);
  animation-name: fadeOn;
}
@keyframes fadeOff {
  0% {
    background-image: var(--onimage);
  }
  100% {
    background-image: var(--offimage);
  }
}

.animation-fade-off {
  background-image: var(--offimage);
  animation-name: fadeOff;
}
.image {
  height: 473px;
}
.image > div {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  animation-duration: 2s;
}
</style>
