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
        <q-icon
          :name="fasCartShopping"
          size="md"
          @click="$router.push({ name: 'cart' })"
          v-if="getItems.length"
          color="info"
        >
          <q-badge color="secondary" floating transparent>
            {{ getItems.length }}
          </q-badge>
        </q-icon>
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
    <!--
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
    >

    </q-drawer> -->

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
} from "@quasar/extras/fontawesome-v6";
import { useCartStore } from "src/stores/cart";

const { getItems } = useCartStore();
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
const logoUrl =
  process.env.ASSET_URL +
  "/assets/logos/lunarblessings/lunarblessings/lb-logo.png";
</script>
