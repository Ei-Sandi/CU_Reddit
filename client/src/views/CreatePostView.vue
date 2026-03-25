<template>
  <div class="post-container">
    <a-card class="post-card" :headStyle="{ textAlign: 'center' }" title="New Post">
      <a-form :model="formState" @finish="onFinish" layout="vertical">

        <a-form-item label="Image">
          <input type="file" @change="handleFileUpload" accept="image/*" />
          <div v-if="formState.imageURL" style="margin-top: 10px;">
            <p style="color: green;">Image uploaded successfully!</p>
            <img :src="formState.imageURL" style="max-height: 100px;" />
          </div>
        </a-form-item>

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

const formState = reactive({
  imageURL: '',
  content: ''
});

const handleFileUpload = async (event) => {
  const target = event.target;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  const formData = new FormData();
  formData.append('upload', file);
  try {
    const res = await fetch('http://localhost:3000/api/v1/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      formState.imageURL = data.links.path;
    } else {
      alert("Image upload failed");
    }
  } catch (e) {
    console.error(e);
  }
}

const onFinish = async () => {
  loading.value = true;

  try {
    const payload = {
      content: formState.content,
      imageURL: formState.imageURL || null
    };

    const response = await fetch(`${config.SERVER_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
