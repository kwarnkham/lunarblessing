<template>
  <div :id="id"></div>
</template>

<script setup>
import { onMounted } from "vue";
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
onMounted(() => {
  google.accounts.id.renderButton(document.getElementById(props.id), {
    theme: "outline",
  });
});
</script>
