<template>
  <div class="post-container">
    <a-card class="post-card" :headStyle="{ textAlign: 'center' }" title="New Post">
      <a-form :model="formState" @finish="onFinish" layout="vertical">

        <a-form-item label="Content" name="content" :rules="[{ required: true }]">
            <a-textarea class="post-input" v-model:value="formState.content" :rows="4" />
        </a-form-item>

        <a-form-item class="submit-container">
          <a-button class="action-btn" type="primary" html-type="submit" :loading="loading">Create Post</a-button>
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

const formState = reactive({ content: '' });

const onFinish = async (values) => {
  loading.value = true;

  try {
    const response = await fetch(`${config.SERVER_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      alert('Post Created.');
      router.push('/');
    } else {
      alert('Failed to create post.');
    }

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.post-container {
  max-width: 400px;
  margin: 100px auto;
}

.post-card {
  border: 1px solid #888;
}

.post-input,
.post-input:hover,
.post-input:focus,
.post-input:focus-within {
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
