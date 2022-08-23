<template>
  <q-page padding class="flex flex-center">
    <div>
      <q-btn-group v-if="userStore.getUser?.telegram_id">
        <q-btn
          :color="notify ? 'primary' : 'grey'"
          label="Notify me via telegram"
          no-caps
          @click="notify = true"
        />
        <q-btn
          :color="notify ? 'grey' : 'primary'"
          label="Do not notify me"
          no-caps
          @click="notify = false"
        />
      </q-btn-group>
      <q-btn no-caps v-else @click="subscribeTelegramBot">
        Send me updates for order status via Telegram
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useBackend from "src/composables/backend";
import { useUserStore } from "src/stores/user";
import { ref, watch } from "vue";

const userStore = useUserStore();
const notify = ref(userStore.getUser.telegram_notify);
const { dialog, localStorage, loading } = useQuasar();
const { checkToken, changeSetting } = useBackend();

const subscribeTelegramBot = () => {
  loading.show();
  checkToken()
    .then((data) => {
      userStore.setUser(data);
      if (data.telegram_id == null)
        dialog({
          title:
            "Please subscribe to the Telegram bot so that we can send you telegram message",
          cancel: true,
        }).onOk(() => {
          const token = localStorage.getItem("token");
          if (token.includes("|") === false) return;
          const payload = token.split("|", 2)[0] + "-" + userStore.getUser.id;
          const url = process.env.DEV
            ? "https://t.me/lunarblessing_dev_bot?start=" + payload
            : "https://t.me/lunarblessing_bot?start=" + payload;
          window.open(url);
        });
      else notify.value = data.telegram_notify;
    })
    .finally(() => {
      loading.hide();
    });
};

watch(notify, () => {
  loading.show();
  changeSetting({
    telegram_notify: notify.value,
    user_id: userStore.getUser.id,
  })
    .then((data) => {
      userStore.setUser(data);
    })
    .finally(() => {
      loading.hide();
    });
});
</script>
