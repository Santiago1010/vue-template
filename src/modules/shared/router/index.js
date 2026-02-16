export default [
  {
    path: "/error",
    component: () => import("../../../layouts/EmptyLayout.vue"),
    children: [
      {
        path: "401",
        name: "unauthorized",
        component: () => import("../pages/UnauthorizedPage.vue"),
        meta: {
          requiresAuth: false,
          title:
            "Page displayed when a user tries to access information not authorized for them.",
        },
      },
      {
        path: "500",
        name: "error",
        component: () => import("../pages/ErrorPage.vue"),
        meta: {
          requiresAuth: false,
          title:
            "Page displayed when an unexpected error occurs when accessing another page.",
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    name: "not-found",
    component: () => import("../../../layouts/EmptyLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/NotFoundPage.vue"),
        meta: {
          requiresAuth: false,
          title:
            "Page that indicates that the site you are trying to access does not exist or is deactivated.",
        },
      },
    ],
  },
];
