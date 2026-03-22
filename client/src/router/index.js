import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import { config } from '../config.js'
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/create_post', name: 'post', component: CreatePostView, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.user.loggedIn) {
    alert("🛑 You must be logged in to view this page.");
    next({
      path: '/login',
      query: { redirect: to.fullPath } 
    });
  } else {
    next();
  }
});

export default router
