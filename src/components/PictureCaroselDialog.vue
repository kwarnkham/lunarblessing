<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="title" class="text-h6 text-center">
          {{ title }}
        </div>
        <q-carousel
          swipeable
          animated
          arrows
          v-model="slide"
          v-model:fullscreen="fullscreen"
          keep-alive
          :prev-icon="fasAngleLeft"
          :next-icon="fasAngleRight"
          thumbnails
          :autoplay="autoPlay"
          :infinite="autoPlay"
          navigation-position="top"
          control-color="primary"
        >
          <q-carousel-slide
            fullscreen
            v-for="picture in pictures"
            :key="picture.id"
            :name="picture.id"
            :img-src="getItemImage(picture.url)"
            class="slide"
          />
          <template v-slot:control>
            <q-carousel-control
              position="bottom-right"
              :offset="[18, 18]"
              class="q-gutter-x-sm"
            >
              <q-btn
                round
                dense
                :icon="fasPause"
                flat
                @click="autoPlay = false"
                color="black"
                text-color="primary"
                v-if="autoPlay"
              />
              <q-btn
                round
                dense
                :icon="fasPlay"
                flat
                @click="autoPlay = true"
                color="black"
                text-color="primary"
                v-else
              />
              <q-btn
                round
                flat
                dense
                color="black"
                text-color="primary"
                :icon="fullscreen ? fasExpand : fasCompress"
                @click="fullscreen = !fullscreen"
              />
            </q-carousel-control>
          </template>
        </q-carousel>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :icon="fasXmark" flat @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import useApp from "src/composables/app.js";
import { ref } from "vue";
import {
  fasExpand,
  fasCompress,
  fasAngleLeft,
  fasAngleRight,
  fasXmark,
  fasPlay,
  fasPause,
} from "@quasar/extras/fontawesome-v6";

const props = defineProps({
  pictures: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
});

const autoPlay = ref(false);

const { getItemImage } = useApp();
const slide = ref(props.pictures[0].id);
const fullscreen = ref(false);
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
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>

<style scoped lang="scss">
.slide {
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
