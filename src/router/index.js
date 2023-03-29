import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory("/"),
  routes: routes,
});

router.beforeEach(async (_to, _from, next) => {
  next();
});

export default router;
