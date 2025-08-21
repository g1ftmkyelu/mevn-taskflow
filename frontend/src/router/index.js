import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard' // Changed default redirect
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/LoginView.vue'),
    meta: { requiresAuth: false, title: 'Login' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Auth/RegisterView.vue'),
    meta: { requiresAuth: false, title: 'Register' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'), // New page
    meta: { requiresAuth: true, title: 'Dashboard' }
  },
  {
    path: '/todos',
    name: 'todos',
    component: () => import('@/views/Todo/TodoListView.vue'),
    meta: { requiresAuth: true, title: 'My Todos' }
  },
  {
    path: '/todos/edit/:id',
    name: 'edit-todo',
    component: () => import('@/views/Todo/TodoEditView.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Edit Todo' }
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/CategoriesView.vue'), // New page
    meta: { requiresAuth: true, title: 'Categories' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/UserProfileView.vue'), // New page
    meta: { requiresAuth: true, title: 'User Profile' }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/ReportsView.vue'), // New page
    meta: { requiresAuth: true, title: 'Reports' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'), // New page
    meta: { requiresAuth: true, title: 'Settings' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false, title: 'Page Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'dashboard' }); // Redirect to dashboard after login/register
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | TaskFlow` : 'TaskFlow';
});

export default router;