<script setup>
import WelcomePage from '@/components/WelcomePage.vue';
import PostGrid from '../components/PostGrid.vue'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div v-if="userStore.user.loggedIn">  
    <div class="user-greeting">
      <div class="greeting-text">
        <h2>Welcome Back, {{ userStore.user.username }} 👋</h2>
        <p>Ready to see what students are talking about?</p>
      </div>
      <RouterLink to="/create_post">
        <a-button type="primary" class="action-btn">Create Post</a-button>
      </RouterLink>
    </div>

    <h3 class="section-title">Latest Posts</h3>
    <PostGrid />
  </div>

  <div v-else>  
    <WelcomePage />
  </div>
</template>

<style scoped>
.user-greeting {
  margin-bottom: 30px;
  padding: 20px 0;
}

.user-greeting h2 {
  font-size: 28px;
  color: #001529;
  margin-bottom: 8px;
  font-weight: 600;
}

.user-greeting p {
  color: #666;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.action-btn {
  background-color: #001529 !important;
  border-color: #001529 !important;
  color: #ffffff !important;
  transition: transform 0.1s ease;
  margin-top: 10px;
}

.action-btn:hover,
.action-btn:focus {
  background-color: #001529 !important;
  border-color: #001529 !important;
  color: #ffffff !important;
}

.action-btn:active {
  transform: scale(0.95);
}

.section-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
</style>
