<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <div v-if="$route.name == 'index'" class="row items-center">
            <q-avatar class="q-mr-sm">
              <img :src="logoUrl" />
            </q-avatar>
            <div>Trying our best</div>
          </div>
          <q-icon
            :name="fasChevronLeft"
            size="sm"
            v-else
            @click="$router.go(-1)"
          />
        </q-toolbar-title>
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
  fasHouse,
  fasChevronLeft,
} from "@quasar/extras/fontawesome-v6";

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
