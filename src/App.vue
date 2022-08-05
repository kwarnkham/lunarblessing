<template>
  <router-view />
</template>

<script setup>
import jwt_decode from "jwt-decode";
import { useQuasar } from "quasar";
import useApp from "./composables/app.js";
import useBackend from "./composables/backend.js";
import { loadScript } from "vue-plugin-load-script";

const { loginWithGoogle } = useBackend();
const { loading } = useQuasar();
const { preserveToken } = useApp();
loading.show();
loadScript("https://accounts.google.com/gsi/client")
  .then(() => {
    google.accounts.id.initialize({
      client_id: process.env.GOOGLE_CLIENT_ID,
      callback: (response) => {
        const email = jwt_decode(response.credential).email;
        loading.show();
        loginWithGoogle({ email })
          .then((data) => {
            preserveToken(data);
          })
          .finally(() => {
            loading.hide();
          });
      },
    });
  })
  .finally(() => {
    loading.hide();
  });

window.fbAsyncInit = function () {
  FB.init({
    appId: "745434533380761",
    cookie: true,
    xfbml: true,
    version: "v14.0",
  });

  FB.AppEvents.logPageView();
};

(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");
</script>
