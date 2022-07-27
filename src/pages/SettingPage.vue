<template>
  <q-page padding class="q-gutter-y-xs">
    <q-card
      v-for="setting in settings"
      :key="setting.label"
      @click="$router.push({ name: setting.routeName })"
    >
      <q-card-section> {{ setting.label }} </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const settings = [
  {
    label: "Edit User Info",
    routeName: "editInfo",
  },
  {
    label: "Change Password",
    routeName: "changePassword",
  },
];
</script>
