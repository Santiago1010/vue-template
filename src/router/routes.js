export default [
  {
    path: "/",
    name: "home",
    component: () => import("../App.vue"),
    meta: {
      requiresAuth: true,
      level: 1,
      description: "Home page",
    },
  },
  {
    path: "/:catchAll(.*)*",
    name: "not-found",
    component: () => import("../modules/auth/pages/SessionExpiredPage.vue"),
  },
];
