import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'

import { config } from '../config.js'
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/create_post', name: 'post', component: CreatePostView, meta: { requiresAuth: true } },
    { path: '/admin', name: 'admin-dashboard', component: AdminDashboardView, meta: { requiresAuth: true, requiresRole: ['admin'] } }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.user.loggedIn) {
    alert("You must be logged in to view this page.");
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }

  if (to.meta.requiresRole) {
    const userRole = userStore.user.role;
    const hasAccess = to.meta.requiresRole.includes(userRole);

    if (!hasAccess) {
      alert("You do not have permission to view this page.");
      return next({ path: '/' });
    }
  }

  next();
});

export default router
