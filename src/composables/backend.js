import { api } from "src/boot/axios";
import useHandleResponse from "./handleResponse";

export default function useBackend() {
  const handleResponse = useHandleResponse();
  return {
    register: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/register",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    login: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/login",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    fetchItems: async (params) => {
      try {
        return await api({
          method: "GET",
          url: "/item",
          params,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    checkToken: async () => {
      try {
        return await api({
          method: "POST",
          url: "/check-token",
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    makeOrder: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/order",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
  };
}
