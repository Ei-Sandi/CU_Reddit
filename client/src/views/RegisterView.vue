<template>
  <div style="max-width: 400px; margin: 50px auto;">
    <a-card style="border: solid 1px" title="Register">
      <a-form :model="formState" @finish="onFinish">

        <a-form-item label="Username" name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="Email" name="email" :rules="[{ required: true, type: 'email' }]">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="[{ required: true }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item label="Retype Password" name="retypePassword" :rules="[{ required: true }]">
          <a-input-password v-model:value="formState.retypePassword" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">Sign Up</a-button>
        </a-form-item>

      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { config } from '../config';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  username: '',
  email: '',
  password: '',
  retypePassword: ''
});

const onFinish = async (values) => {
  loading.value = true;
  try {
    const response = await fetch(`${config.SERVER_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Registration successful! Please login.');
      router.push('/login');
    } else {
      alert('Registration failed');
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
