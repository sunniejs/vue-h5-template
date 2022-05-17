import { createRouter, createWebHistory, Router } from 'vue-router';
import routes from './routes';

const router: Router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  next();
});

export default router;
