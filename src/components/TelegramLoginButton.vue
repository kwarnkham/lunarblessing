<template>
  <div ref="telegram"></div>
</template>

<script setup>
import useApp from "src/composables/app";
import useBackend from "src/composables/backend";
import { onBeforeUnmount, onMounted, ref } from "vue";

const { loginWithTelegram } = useBackend();
const { preserveToken } = useApp();
const authCallBack = (user) => {
  loginWithTelegram(user).then((data) => {
    preserveToken(data);
  });
};
const telegram = ref(null);
const script = document.createElement("script");
script.async = true;
script.src = "https://telegram.org/js/telegram-widget.js?19";
script.setAttribute("data-telegram-login", "lunarblessing_bot");
script.setAttribute("data-size", "medium");
script.setAttribute("data-userpic", false);
script.setAttribute("data-request-access", "write");
window.onTelegramAuth = authCallBack;
script.setAttribute("data-onauth", "onTelegramAuth(user)");
script.onload = () => {
  console.log("telegram login widget has been loaded");
};

onMounted(() => {
  telegram.value.appendChild(script);
});

onBeforeUnmount(() => {
  while (telegram.value.firstChild)
    telegram.value.removeChild(telegram.value.lastChild);
});
</script>
