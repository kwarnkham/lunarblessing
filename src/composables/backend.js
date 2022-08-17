import { api } from "src/boot/axios";
import useHandleResponse from "./handleResponse";
import useUtility from "./utility";

export default function useBackend() {
  const handleResponse = useHandleResponse();
  const { buildForm } = useUtility();
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
          method: "GET",
          url: "/check-token",
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    changeSetting: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/user/setting/" + data.user_id,
          data,
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
    fetchAnOrder: async (orderid) => {
      try {
        return await api({
          method: "GET",
          url: "/order/" + orderid,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    fetchOrders: async (params) => {
      if (params.mobile == "") params.mobile = undefined;
      if (params.code == "") params.code = undefined;
      if (params.status == 0 || params.status == "0") params.status = undefined;
      try {
        return await api({
          method: "GET",
          url: "/order",
          params,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    loginWithFacebook: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/login/fb",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    loginWithGoogle: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/login/google",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    loginWithTelegram: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/login/telegram",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    updateUser: async (data) => {
      try {
        return await api({
          method: "PUT",
          url: "/user",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
    changePassword: async (data) => {
      try {
        return await api({
          method: "POST",
          url: "/password",
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },

    updateOrderStatus: async (order, data) => {
      try {
        return await api({
          method: "POST",
          url: "/order/status/" + order.id,
          data,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },

    fetchPayments: async (params) => {
      try {
        return await api({
          method: "GET",
          url: "/payment",
          params,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },

    pay: async (order, data) => {
      try {
        return await api({
          method: "POST",
          url: "/order/pay/" + order.id,
          data: buildForm(data),
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },

    updateOrderInfo: async (order) => {
      try {
        return await api({
          method: "PUT",
          url: "/order/" + order.id,
          data: order,
        }).then(({ data }) => data);
      } catch (error) {
        handleResponse(error);
      }
    },
  };
}
