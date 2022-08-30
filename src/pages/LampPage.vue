<template>
  <q-page padding v-if="itemStore.getItems.length" class="page bg-grey-4">
    <div class="full-width text-center">
      <q-btn label="What's my zodiac sign?" no-caps flat @click="showSigns" />
    </div>
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
          ref="imgDiv"
          :style="{
            '--onimage': onImage,
            '--offimage': offImage,
          }"
        ></div>
      </div>

      <div class="row justify-around">
        <q-btn
          no-caps
          :icon="isBody ? fasCircle : farCircle"
          @click="isBody = !isBody"
          color="info"
          push
        />
        <q-btn
          :icon="switchedOn ? fasToggleOn : fasToggleOff"
          glossy
          :color="switchedOn ? 'primary' : 'black'"
          @click="switchedOn = !switchedOn"
        />
        <q-btn :icon="fasImage" color="info" flat @click="showAllPictures" />
      </div>
    </div>
    <q-expansion-item
      expand-separator
      :icon="fasPenNib"
      :expand-icon="fasChevronDown"
      popup
      label="Engrave"
      caption="You may engrave custom text to the product"
    >
      <div class="text-center relative-position">
        <img
          :src="getImage('/asset/engrave-bg.jpeg')"
          alt="engrave-preview"
          style="height: 300px"
        />
        <div
          class="engrave-text text-weight-bold edu-font"
          style="width: 100px"
        >
          {{ quote }}
        </div>
        <div>
          <span class="text-caption">
            The actual result may look a little different.
          </span>
          <q-btn
            label="See actual result."
            no-caps
            flat
            color="info"
            @click="explainEngrave"
          />
        </div>
      </div>

      <q-input
        class="edu-font"
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
            val == ''
              ? true
              : val.length <= 60 || 'Keep it a bit shorter please',
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
    </q-expansion-item>

    <!-- <div class="q-mt-sm rounded-borders dim-bright-radio">
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
    </div> -->

    <div class="q-mt-sm">
      <q-btn
        :label="'Done!'"
        no-caps
        color="positive"
        class="fit"
        @click="addToCart"
        :disabled="quote.length > 60"
      />
    </div>
  </q-page>
</template>

<script setup>
import {
  farCircle,
  fasCircle,
  fasImage,
  fasInfo,
  fasToggleOff,
  fasToggleOn,
  fasChevronDown,
  fasPenNib,
} from "@quasar/extras/fontawesome-v6";
import { useCssVar } from "@vueuse/core";
import { useQuasar } from "quasar";
import PictureCaroselDialog from "src/components/PictureCaroselDialog";
import PictureDialog from "src/components/PictureDialog";
import useApp from "src/composables/app";
import { useCartStore } from "src/stores/cart";
import { useItemsStore } from "src/stores/items";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const imgDiv = ref();
const isBody = ref(true);
const quote = ref("");
const dimmedLid = ref(false);
const switchedOn = ref(true);
const cartStore = useCartStore();
const { dialog } = useQuasar();
const router = useRouter();
const { getImage } = useApp();

const itemStore = useItemsStore();
const selectedItem = ref(itemStore.getItems[0]);
const showSigns = () => {
  dialog({
    title: "Zodiac Signs Dates",
    html: true,
    message: `
    <ul style="list-style: circle; font-size: 3.9vw; padding-left:10px">
      <li>Aries : March 21 - April 19</li>
      <li>Taurus : April 20 - May 20</li>
      <li>Gemini: May 21 - June 21</li>
      <li>Cancer: June 22 - July 22</li>
      <li>Leo: July 23 - August 22</li>
      <li>Virgo: August 23 - September 22</li>
      <li>Libra: September 23 - October 22</li>
      <li>Scorpio: October 23 - November 22</li>
      <li>Sagittarius: November 23 - December 21</li>
      <li>Capricorn: December 22 - January 19</li>
      <li>Aqurius: January 20 - February 18</li>
      <li>Pisces: February 19 - March 20</li>
    </ul>`,
  });
};
const explainEngrave = () => {
  dialog({
    component: PictureDialog,
    componentProps: {
      src: getImage("/asset/engrave-example.jpeg"),
      text: "We engrave the text you provided to the lamp. It's optional.",
    },
  });
};
// const explainDimmedLid = () => {
//   dialog({
//     component: PictureDialog,
//     componentProps: {
//       src: "https://spaces.madewithheart.tech/lunarblessing/asset/aries.png",
//       text: "You might want to choose dimmed lid if you don't want bright light from the top(lid)",
//     },
//   });
// };

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
const showAllPictures = () => {
  dialog({
    title: "Aries",
    maximized: true,
    component: PictureCaroselDialog,
    componentProps: {
      pictures: selectedItem.value.pictures,
      title: selectedItem.value.name,
    },
  });
};

const onImage = useCssVar("--onimage", imgDiv, {
  initialValue: `url(${getImage(
    selectedItem.value.pictures.find(
      (picture) => picture.type == (isBody.value ? 3 : 5)
    ).url
  )})`,
});

const offImage = useCssVar("--offimage", imgDiv, {
  initialValue: `url(${getImage(
    selectedItem.value.pictures.find(
      (picture) => picture.type == (isBody.value ? 2 : 4)
    ).url
  )})`,
});
const setImageUrl = () => {
  onImage.value = `url(${getImage(
    selectedItem.value.pictures.find(
      (picture) => picture.type == (isBody.value ? 3 : 5)
    ).url
  )})`;

  offImage.value = `url(${getImage(
    selectedItem.value.pictures.find(
      (picture) => picture.type == (isBody.value ? 2 : 4)
    ).url
  )})`;
};

watch(selectedItem, setImageUrl);
watch(isBody, setImageUrl);
</script>

<style scoped lang="scss">
.engrave-text {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, 0);
}
.dim-bright-radio {
  border: solid $info 1px;
  padding-top: 6px;
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
  height: 480px;
}
.image > div {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  animation-duration: 2s;
}
</style>
