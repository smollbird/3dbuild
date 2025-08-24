import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../views/Home.vue');
const FigmaPreview = () => import('../views/FigmaPreview.vue');
const Viewer = () => import('../views/Viewer.vue');
const Design = () => import('../views/Design.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/figma', name: 'figma', component: FigmaPreview },
    { path: '/viewer', name: 'viewer', component: Viewer },
    { path: '/design', name: 'design', component: Design }
  ]
});

export default router;


