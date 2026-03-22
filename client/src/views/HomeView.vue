<script setup>
import WelcomePage from '@/components/WelcomePage.vue';
import BlogGrid from '../components/BlogGrid.vue'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div v-if="userStore.user.loggedIn">  
    <h2>Latest Posts</h2>
    <BlogGrid />
  </div>

  <div v-else>  
    <WelcomePage />
  </div>
</template>
