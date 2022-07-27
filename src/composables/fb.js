export default function () {
  return {
    loginWithFb: () => {
      FB.getLoginStatus((response) => {
        console.log(response, "check facbook login status before login");
        if (response.status == "connected") {
          // params.fb_login_id = response.authResponse.userID;
          // login(params);
        } else {
          FB.login((response) => {
            console.log(response, "fb_login");
            if (response.status == "connected") {
              // params.fb_login_id = response.authResponse.userID;
              // login(params);
            }
          });
        }
      });
    },
  };
}
