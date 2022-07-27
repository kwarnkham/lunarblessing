import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import useBackend from "./backend";

export default function useFb() {
  const { loginWithFacebook } = useBackend();
  const { localStorage } = useQuasar();
  const userStore = useUserStore();
  return {
    loginWithFb: async () => {
      return new Promise((resolve, reject) => {
        FB.getLoginStatus((response) => {
          console.log(response, "check facbook login status before login");
          if (response.status == "connected") {
            loginWithFacebook({
              fb_login_id: response.authResponse.userID,
            }).then(({ user, token }) => {
              localStorage.set("token", token);
              api.defaults.headers.common["Authorization"] = "Bearer " + token;
              userStore.setUser(user);
              resolve(true);
            });
          } else {
            FB.login((response) => {
              console.log(response, "fb_login");
              if (response.status == "connected") {
                loginWithFacebook({
                  fb_login_id: response.authResponse.userID,
                }).then((data) => {
                  if (data) {
                    const { user, token } = data;
                    localStorage.set("token", token);
                    api.defaults.headers.common["Authorization"] =
                      "Bearer " + token;
                    userStore.setUser(user);
                    resolve(true);
                  } else {
                    reject();
                  }
                });
              } else {
                reject();
              }
            });
          }
        });
      });
    },
  };
}
