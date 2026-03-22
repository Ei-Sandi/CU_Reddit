<template>
  <div class="auth-container">
    <a-card class="auth-card" :headStyle="{ textAlign: 'center' }" title="Login">
      <a-form :model="formState" @finish="onFinish" layout="vertical">

        <a-form-item label="Email" name="email" :rules="[{ required: true }]">
          <a-input v-model:value="formState.email" class="auth-input" />
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="[{ required: true }]">
          <a-input-password v-model:value="formState.password" class="auth-input" />
        </a-form-item>

        <a-form-item class="submit-container">
          <a-button class="action-btn" type="primary" html-type="submit" :loading="loading">Login</a-button>
        </a-form-item>

      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { config } from '../config';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const formState = reactive({ email: '', password: '' });

const onFinish = async (values) => {
  loading.value = true;

  const authString = btoa(`${values.email}:${values.password}`);

  try {
    const response = await fetch(`${config.SERVER_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      userStore.login(data);
      alert('Welcome back ' + userStore.user.username);

      const redirectPath = router.currentRoute.value.query.redirect || '/';
      router.push(redirectPath);
    
    } else {
      alert('Login failed');
    }

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 100px auto;
}

.auth-card {
  border: 1px solid #888;
}

.auth-input,
.auth-input:hover,
.auth-input:focus,
.auth-input:focus-within {
  border: 1px solid #888 !important;
  box-shadow: none !important;
}

.submit-container {
  text-align: center;
}

.action-btn {
  background-color: #001529 !important;
  border-color: #001529 !important;
  color: #ffffff !important;
  transition: transform 0.1s ease;
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
</style>
