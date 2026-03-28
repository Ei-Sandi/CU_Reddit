<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

onMounted(() => {
  // Check if token is expired every minute and log out if it is
  setInterval(() => {
    if (userStore.user.loggedIn && userStore.token) {
      try {
        const payload = JSON.parse(atob(userStore.token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          alert('Your session has expired. Please log in again.');
          handleLogout();
        }
      } catch (e) {
        handleLogout();
      }
    }
  }, 60000); // 60 seconds
})
</script>

<template>
  <a-layout class="layout">
    <a-layout-header>
      <a-menu class="nav-menu" theme="dark" mode="horizontal" :selectable="false">
        <a-menu-item key="1">
            <RouterLink class="nav-link" to="/">CU Reddit</RouterLink>
        </a-menu-item>

        <a-menu-item key="2" v-if="!userStore.user.loggedIn" style="margin-left: auto;">
          <RouterLink class="nav-link" to="/login">Login</RouterLink>
        </a-menu-item>

        <a-menu-item key="3" v-if="!userStore.user.loggedIn">
          <RouterLink class="nav-link" to="/register">Register</RouterLink>
        </a-menu-item>

        <a-menu-item key="4" v-if="userStore.user.role === 'admin'" style="margin-left: auto;">
          <RouterLink class="nav-link" to="/admin"> Admin Dashboard </RouterLink>
        </a-menu-item>

        <a-menu-item key="5" v-if="userStore.user.loggedIn" style="margin-left: auto;">
          <RouterLink class="nav-link" to="/profile">My Profile</RouterLink>
        </a-menu-item>

        <a-menu-item key="6" v-if="userStore.user.loggedIn" @click="handleLogout">
          <span class="nav-link">Logout</span>
        </a-menu-item>

      </a-menu>
    </a-layout-header>

    <a-layout-content class="main-content">
      <div class="site-layout-content">
        <RouterView />
      </div>
    </a-layout-content>

  </a-layout>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

.nav-menu {
  color: #ffffff;
}

.main-content {
  padding: 0 50px;
  margin-top: 20px;
}

.nav-link {
  display: inline-block;
  transition: transform 0.1s ease;
}

.nav-link:hover {
  text-decoration: underline;
}

.nav-link:active {
  transform: scale(0.95);
}
</style>
