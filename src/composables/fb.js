import useApp from "./app";
import useBackend from "./backend";

export default function useFb() {
  const { loginWithFacebook } = useBackend();
  const { preserveToken } = useApp();
  return {
    loginWithFb: async () => {
      return new Promise((resolve, reject) => {
        FB.getLoginStatus((response) => {
          console.log(response, "check facbook login status before login");
          if (response.status == "connected") {
            loginWithFacebook({
              fb_login_id: response.authResponse.userID,
            }).then((data) => {
              preserveToken(data);
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
                    preserveToken(data);
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
