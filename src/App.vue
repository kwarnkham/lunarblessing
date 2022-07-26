<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from "quasar";
import { useCartStore } from "./stores/cart";

const { $onAction } = useCartStore();
const { localStorage } = useQuasar();
$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    after((result) => {
      localStorage.set("cartItems", result);
    });
  }
);
</script>
