<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
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

        <a-menu-item key="6" v-if="userStore.user.loggedIn" @click="userStore.logout">
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
