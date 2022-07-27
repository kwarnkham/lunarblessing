<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar class="row justify-between">
        <div v-if="$route.name == 'index'" class="row items-center">
          <q-avatar class="q-mr-sm">
            <img :src="logoUrl" />
          </q-avatar>
          <div>Trying our best</div>
        </div>
        <div v-else class="row justify-between">
          <q-icon :name="fasChevronLeft" size="sm" @click="$router.go(-1)" />
        </div>
        <div>
          <q-btn
            flat
            round
            :icon="fasCartShopping"
            size="md"
            @click="$router.push({ name: 'cart' })"
            v-if="cartStore.getItems.length"
            color="info"
          >
            <q-badge color="secondary" floating transparent>
              {{
                cartStore.getItems.reduce(
                  (carry, item) => item.quantity + carry,
                  0
                )
              }}
            </q-badge>
          </q-btn>
          <q-btn
            v-if="userStore.getUser"
            flat
            round
            :icon="fasBars"
            size="md"
            @click="leftDrawerOpen = true"
            color="info"
          />
          <q-btn
            v-else
            flat
            round
            :icon="fasRightToBracket"
            size="md"
            @click="showLoginDialog"
            color="info"
          />
        </div>
      </q-toolbar>

      <!-- <q-tabs
        align="center"
        active-color="white"
        class="bg-grey-7 text-info"
        active-class="bg-primary"
      >
        <q-route-tab
          v-for="tab in tabs"
          :key="tab.routeName"
          :to="{ name: tab.routeName }"
          no-caps
        >
          <q-icon :name="tab.icon" v-if="tab.icon" size="sm" />
          <span v-else class="text-subtitle1">
            {{ tab.label }}
          </span>
        </q-route-tab>
      </q-tabs> -->
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
    >
      <q-list separator padding class="bg-amber-1">
        <q-item
          clickable
          @click="item.action"
          v-for="item in drawerItems"
          :key="item.label"
          :to="{ name: item.routeName }"
          exact-active-class="bg-blue-grey-6 text-white"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" color="secondary" />
          </q-item-section>

          <q-item-section class="text-subtitle1">
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view class="bg-grey-4" />
    </q-page-container>

    <q-footer elevated class="bg-grey-4 text-white">
      <q-toolbar class="row justify-around no-wrap">
        <q-toolbar-title class="text-center" shrink>
          <q-avatar>
            <img :src="logoUrl" />
          </q-avatar>
          <div class="text-accent">Lunar Blessing</div>
        </q-toolbar-title>
        <q-icon :name="fasPhone" size="sm" color="accent" />
        <q-icon :name="fabFacebook" size="sm" class="fb-color" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import {
  fasPhone,
  fabFacebook,
  fasCartShopping,
  fasChevronLeft,
  fasBars,
  fasRightFromBracket,
  fasRightToBracket,
  fasGear,
  fasReceipt,
} from "@quasar/extras/fontawesome-v6";
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import { useCartStore } from "src/stores/cart";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const leftDrawerOpen = ref(false);
const { localStorage, dialog } = useQuasar();
const userStore = useUserStore();
const { showLoginDialog } = useApp();

// const tabs = [
//   {
//     routeName: "index",
//     icon: fasHouse,
//   },
//   {
//     routeName: "lamp",
//     label: "Lamp",
//   },
// ];

const router = useRouter();
const logout = () => {
  dialog({
    title: "Do you want to logout?",
    persistent: true,
    cancel: {
      noCaps: true,
      flat: true,
    },
    ok: {
      flat: true,
      noCaps: true,
      label: "Logout",
    },
  }).onOk(() => {
    localStorage.remove("token");
    router.push({ name: "index" });
    userStore.setUser(null);
    leftDrawerOpen.value = false;
  });
};

const drawerItems = [
  {
    icon: fasGear,
    label: "Setting",
    routeName: "setting",
  },
  {
    icon: fasReceipt,
    label: "Orders",
    routeName: "order",
  },
  {
    icon: fasRightFromBracket,
    label: "Logout",
    action: logout,
    routeName: "logout",
  },
];
const logoUrl =
  process.env.ASSET_URL +
  "/assets/logos/lunarblessings/lunarblessings/lb-logo.png";
</script>
