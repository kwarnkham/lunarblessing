const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "index",
      },
      {
        path: "lamp",
        component: () => import("pages/LampPage.vue"),
        name: "lamp",
      },
      {
        path: "cart",
        component: () => import("pages/CartPage.vue"),
        name: "cart",
      },
      {
        path: "checkout",
        component: () => import("pages/CheckoutPage.vue"),
        name: "checkout",
      },
      {
        path: "order-details/:id",
        component: () => import("pages/OrderDetailsPage.vue"),
        name: "orderDetails",
      },
      {
        path: "order",
        component: () => import("pages/OrderPage.vue"),
        name: "order",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
