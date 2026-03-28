<template>
  <div class="auth-container">
    <a-card class="auth-card" :headStyle="{ textAlign: 'center' }" title="Register">
      <a-form :model="formState" @finish="onFinish" layout="vertical">

        <a-form-item label="Username" name="username"
          :rules="[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters long!' }
          ]">
          <a-input v-model:value="formState.username" class="auth-input" />
        </a-form-item>

        <a-form-item label="Email" name="email" 
          :rules="[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
            { pattern: /^[a-zA-Z0-9._%+-]+@coventry\.ac\.uk$/, message: 'Email must be a @coventry.ac.uk address!' }
          ]">
          <a-input v-model:value="formState.email" class="auth-input" />
        </a-form-item>

        <a-form-item label="Password" name="password" 
          :rules="[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters long!' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!' }
          ]">
          <a-input-password v-model:value="formState.password" class="auth-input" />
        </a-form-item>

        <a-form-item label="Retype Password" name="retypePassword" 
          :rules="[
            { required: true, message: 'Please retype your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]">
          <a-input-password v-model:value="formState.retypePassword" class="auth-input" />
        </a-form-item>

        <a-form-item class="submit-container">
          <a-button class="action-btn" type="primary" html-type="submit" :loading="loading">Sign Up</a-button>
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
