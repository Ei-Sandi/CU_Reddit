<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <a-layout class="layout">
    <a-layout-header>
      <div style="color: #ffffff;" class="logo">CU Reddit</div>

      <a-menu style="color: #ffffff;" theme="dark" mode="horizontal" :selectable="false">
        <a-menu-item key="1">
          <RouterLink to="/">Home</RouterLink>
        </a-menu-item>

        <a-menu-item key="2" v-if="!userStore.user.loggedIn">
          <RouterLink to="/login">Login</RouterLink>
        </a-menu-item>

        <a-menu-item key="3" v-if="!userStore.user.loggedIn">
          <RouterLink to="/register">Register</RouterLink>
        </a-menu-item>

        <a-menu-item key="4" v-else>
          Hello, {{ userStore.user.username }}
        </a-menu-item>

        <a-menu-item key="5" v-if="userStore.user.loggedIn" @click="userStore.logout">
          Logout
        </a-menu-item>

      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 50px; margin-top: 20px">
      <div class="site-layout-content">
        <RouterView />
      </div>
    </a-layout-content>

  </a-layout>
</template>
