import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/todos'
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
    next({ name: 'todos' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | TaskFlow` : 'TaskFlow';
});

export default router;