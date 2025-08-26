import { createRouter, createWebHistory } from 'vue-router';

const Viewer = () => import('../views/Viewer.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'viewer', component: Viewer }
  ]
});

export default router;


