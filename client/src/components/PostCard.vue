<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { config } from '@/config';

const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  post_id: [String, Number],
  username: String,
  content: String,
  created_at: String,
  imageURL: String,
  user_id: [String, Number]
})

const isEditing = ref(false);
const editContent = ref(props.content);

async function deletePost() {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`${config.SERVER_URL}/posts/${props.post_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })

    if (response.ok) {
      alert('Post Deleted.');
      window.location.reload();
    } else {
      const data = await response.json();
      alert(`Post Deletion failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleEdit() {
  try {
    const response = await fetch(`${config.SERVER_URL}/posts/${props.post_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ content: editContent.value })
    })

    if (response.ok) {
      alert('Post Updated.');
      window.location.reload();
    } else {
      const data = await response.json();
      alert(`Post editing failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <a-card hoverable style="width: 300px; position: relative;">

    <div class="top-actions">
      <EditOutlined class="action-icon" key="edit" v-can="{ role: ['admin'], ownerId: user_id }"
        @click="isEditing = !isEditing" />
      <DeleteOutlined class="action-icon delete-icon" key="delete" v-can="{ role: ['admin'], ownerId: user_id }"
        @click="deletePost" />
    </div>

    <template #cover>
      <img :alt="title" :src="imageURL || 'https://picsum.photos/300/200'" />
    </template>

    <a-card-meta :title="username">
      <template #description>
        <div v-if="!isEditing">
          <p>{{ content }}</p>
        </div>
        <div v-else>
          <a-textarea v-model:value="editContent" :rows="3" style="margin-bottom: 10px;" />
          <a-button type="primary" size="small" @click="handleEdit">Save</a-button>
          <a-button size="small" style="margin-left: 8px;" @click="isEditing = false">Cancel</a-button>
        </div>
        <small style="color: gray;">Posted: {{ new Date(created_at).toLocaleString() }}</small>
      </template>
    </a-card-meta>
  </a-card>
</template>

<style scoped>
.top-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.85);
  /* Light background to make buttons visible over dark images */
  padding: 6px 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
  color: #333;
}

.action-icon:hover {
  transform: scale(1.2);
  color: #1890ff;
}

.delete-icon {
  color: #ff4d4f;
}

.delete-icon:hover {
  color: #cf1322;
}
</style>
