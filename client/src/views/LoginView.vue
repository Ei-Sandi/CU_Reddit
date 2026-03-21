<template>
  <div style="max-width: 400px; margin: 50px auto;">
    <a-card style="border: solid" title="Login">
      <a-form :model="formState" @finish="onFinish">

        <a-form-item label="Email" name="email" :rules="[{ required: true }]">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="[{ required: true }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">Login</a-button>
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
      router.push('/');
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
