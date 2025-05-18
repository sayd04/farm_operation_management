import { createRouter, createWebHistory } from 'vue-router'



const routes = [
  { path: '/', name: 'dashboard', component: () => import('./components/EmptySection.vue') },
  { path: '/planting-management', name: 'planting-management', component: () => import('./components/EmptySection.vue') },
  { path: '/task-management', name: 'task-management', component: () => import('./components/EmptySection.vue') },
  { path: '/harvest', name: 'harvest', component: () => import('./components/EmptySection.vue') },
  { path: '/sales', name: 'sales', component: () => import('./components/EmptySection.vue') },
  { path: '/inventory', name: 'inventory', component: () => import('./components/EmptySection.vue') },
  { path: '/expenses', name: 'expenses', component: () => import('./components/EmptySection.vue') },
  { path: '/orders', name: 'orders', component: () => import('./components/EmptySection.vue') },
  { path: '/laborers', name: 'laborers', component: () => import('./components/Laborers.vue') },
  { path: '/weather-forecast', name: 'weather-forecast', component: () => import('./components/WeatherForecast.vue')},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router