import { useQuasar } from "quasar";
import { fasCircleExclamation } from "@quasar/extras/fontawesome-v6";
export default function useHandleResponse() {
  const { notify } = useQuasar();
  const defaultMessage =
    "Opps! Something went wrong. Please contact the system developer.";
  const handleResponse = (e) => {
    console.error(e);
    if (e.response?.status == 422) {
      let message = "";
      const errors = e.response.data.errors;
      const errorKeys = Object.keys(errors);
      errorKeys.forEach((key) => (message += errors[key]));
      notify({
        message,
        type: "negative",
        icon: fasCircleExclamation,
      });
    } else if (e.response?.status == 401) {
      notify({
        message: "Mobile and password doesn't match",
        type: "negative",
        icon: fasCircleExclamation,
      });
    } else {
      if (e.response)
        notify({
          message: e.response.data.message || defaultMessage,
          type: "negative",
          icon: fasCircleExclamation,
        });
      else
        notify({
          message: e.message,
          type: "negative",
          icon: fasCircleExclamation,
        });
    }
  };

  return handleResponse;
}
