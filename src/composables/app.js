import { useQuasar } from "quasar";
import LoginDialog from "src/components/LoginDialog";
import { fasCheck } from "@quasar/extras/fontawesome-v6";

export default function useApp() {
  const { notify, dialog } = useQuasar();
  return {
    showLoginDialog: () => {
      dialog({
        component: LoginDialog,
      }).onOk(() => {
        notify({
          message: "Login success",
          type: "positive",
          icon: fasCheck,
        });
      });
    },
  };
}
