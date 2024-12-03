import { createRouter, createWebHistory } from 'vue-router'
import Dispatcher from '../views/DispatcherView.vue';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/dispatcher',
      name: 'Dispatcher',
      component: Dispatcher
    }
  ]
})

export default router