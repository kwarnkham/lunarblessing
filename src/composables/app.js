import { useQuasar } from "quasar";
import LoginDialog from "src/components/LoginDialog";
import {
  farCircleCheck,
  fasCheck,
  fasCircleCheck,
  fasCircleExclamation,
  fasCircleInfo,
  fasCircleXmark,
  fasInfo,
  fasTruckArrowRight,
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
    getImage: (name) => process.env.ASSET_URL + name,
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
    getStatusIcon: (status) => {
      status = Number(status);
      switch (status) {
        case 1:
          return fasCircleInfo;
        case 2:
          return farCircleCheck;
        case 3:
          return fasTruckArrowRight;
        case 4:
          return fasCircleCheck;
        case 5:
          return fasCircleXmark;
        default:
          return fasCircleInfo;
      }
    },
    groupItems: (items) => {
      const group = {};
      items.forEach((e) => {
        const entry = (group[e.id + e.text] = group[e.id + e.text] || {
          ...e,
          quantity: 0,
        });
        entry.quantity += e.quantity;
      });
      return Object.values(group);
    },
  };
}
