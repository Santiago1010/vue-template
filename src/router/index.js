import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
// import { useAuthStore } from "../modules/auth/store/auth.store";

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  // const auth = useAuthStore();

  // if (to.meta.requiresAuth && !auth.isAuthenticated) {
  //   return next({ name: "login" });
  // }

  next();
});

export default router;
