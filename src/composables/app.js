import { useQuasar } from "quasar";
import LoginDialog from "src/components/LoginDialog";
import {
  fasCheck,
  fasCircleExclamation,
  fasInfo,
} from "@quasar/extras/fontawesome-v6";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";

export default function useApp() {
  const { notify, dialog, localStorage } = useQuasar();
  const userStore = useUserStore();
  const successNotify = (message) => {
    notify({
      message,
      type: "positive",
      icon: fasCheck,
    });
  };

  const errorNotify = (message) => {
    notify({
      message,
      type: "negative",
      icon: fasCircleExclamation,
    });
  };

  const infoNotify = (message) => {
    notify({
      message,
      type: "info",
      icon: fasInfo,
    });
  };
  return {
    showLoginDialog: () => {
      dialog({
        component: LoginDialog,
      }).onOk(() => {
        successNotify("Login success");
      });
    },
    preserveToken: ({ user, token }) => {
      localStorage.set("token", token);
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      userStore.setUser(user);
    },
    successNotify,
    errorNotify,
    infoNotify,
    getItemImage: (name) => process.env.ASSET_URL + name,
    parseOrderStatus: (status) => {
      status = Number(status);
      switch (status) {
        case 1:
          return "Pending";
        case 2:
          return "Confirmed";
        case 3:
          return "Dispatched";
        case 4:
          return "Completed";
        case 5:
          return "Canceled";
        default:
          console.warn("unknown order status");
          return status;
      }
    },
    isAdmin: (user) => {
      return user.roles?.map((e) => e.name).includes("admin");
    },
  };
}
