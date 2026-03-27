<script setup>
import { ref, onMounted } from 'vue';
import { EditOutlined, DeleteOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { config } from '@/config';

const userStore = useUserStore();

const props = defineProps({
  comment_id: [String, Number],
  username: String,
  comment: String,
  user_id: [String, Number],
  likes_count: { type: Number, default: 0 }
});

const isEditing = ref(false);
const editContent = ref(props.comment);

const hasLiked = ref(false);
const likeCount = ref(props.likes_count);

onMounted(async () => {
  try {
    const response = await fetch(`${config.SERVER_URL}/comment_likes/${props.comment_id}/is_liked`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      hasLiked.value = data.liked;
    }
  } catch (error) {
    console.error("Failed to fetch like status:", error);
  }
});

async function deleteComment() {
  if (!confirm("Are you sure you want to delete this comment?")) return;

  try {
    const response = await fetch(`${config.SERVER_URL}/comments/${props.comment_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.ok) {
      alert('Comment Deleted.');
      window.location.reload(); 
    } else {
      const data = await response.json();
      alert(`Comment Deletion failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleEdit() {
  try {
    const response = await fetch(`${config.SERVER_URL}/comments/${props.comment_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ content: editContent.value })
    });

    if (response.ok) {
      alert('Comment Updated.');
      window.location.reload();
    } else {
      const data = await response.json();
      alert(`Comment editing failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function likeComment() {
  try {
    const response = await fetch(`${config.SERVER_URL}/comment_likes/${props.comment_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.ok) {
      hasLiked.value = true;
      likeCount.value++;
    } else {
      const data = await response.json();
      alert(`Comment Like failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeLikeFromComment() {
  try {
    const response = await fetch(`${config.SERVER_URL}/comment_likes/${props.comment_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.ok) {
      hasLiked.value = false;
      likeCount.value = Math.max(0, likeCount.value - 1);
    } else {
      const data = await response.json();
      alert(`Comment Unlike failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="comment-card">
    <div class="comment-header">
      <strong>{{ username }}</strong>
      <div class="comment-actions">
        <EditOutlined class="action-icon" @click="isEditing = !isEditing" v-can="{ role: ['admin'], ownerId: user_id }" />
        <DeleteOutlined class="action-icon" @click="deleteComment" v-can="{ role: ['admin'], ownerId: user_id }" />
      </div>
    </div>
    <div v-if="!isEditing">
      <p>{{ comment }}</p>
    </div>
    <div v-else>
      <a-textarea v-model:value="editContent" :rows="2" style="margin-bottom: 8px;" />
      <a-button type="primary" size="small" @click="handleEdit">Save</a-button>
      <a-button size="small" style="margin-left: 8px;" @click="isEditing = false">Cancel</a-button>
    </div>
    <div class="comment-footer">
      <div class="like-section">
        <template v-if="hasLiked">
          <LikeFilled class="like-icon liked" @click="removeLikeFromComment" />
        </template>
        <template v-else>
          <LikeOutlined class="like-icon" @click="likeComment" />
        </template>
        <span class="like-count">{{ likeCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-card {
  background-color: #fafafa; /* Lighter grey background */
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
  position: relative;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  cursor: pointer;
}

.comment-card p {
  margin: 4px 0;
}

.comment-footer {
  margin-top: 8px;
}

.like-section {
  display: flex;
  align-items: center;
  gap: 4px;
}

.like-icon {
  cursor: pointer;
  font-size: 16px;
}

.like-icon.liked {
  color: #1890ff;
}

.like-count {
  font-size: 12px;
  color: #8c8c8c;
}
</style>
