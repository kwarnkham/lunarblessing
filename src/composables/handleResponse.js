import useApp from "./app";
export default function useHandleResponse() {
  const { errorNotify } = useApp();
  const defaultMessage =
    "Opps! Something went wrong. Please contact the system developer.";
  const handleResponse = (e) => {
    console.error(e);
    if (e.response?.status == 422) {
      let message = "";
      const errors = e.response.data.errors;
      const errorKeys = Object.keys(errors);
      errorKeys.forEach((key) => (message += errors[key]));
      errorNotify(message);
    } else if (e.response?.status == 401) {
      errorNotify("Mobile and password doesn't match");
    } else {
      if (e.response) errorNotify(e.response.data.message || defaultMessage);
      else errorNotify(e.message);
    }
  };

  return handleResponse;
}
