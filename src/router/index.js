import { createRouter, createWebHistory } from 'vue-router';

const Index = () => import('../views/Index.vue');

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      title: '海岛生存'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;