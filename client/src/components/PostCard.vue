<script setup>
import { ref, onMounted } from 'vue';
import { EditOutlined, DeleteOutlined, LikeOutlined, LikeFilled, CommentOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { config } from '@/config';
import CommentCard from './CommentCard.vue';

const userStore = useUserStore();

const props = defineProps({
  post_id: [String, Number],
  username: String,
  content: String,
  created_at: String,
  imageURL: String,
  user_id: [String, Number],
  likes_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0}
})

const isEditing = ref(false);
const editContent = ref(props.content);

const hasLiked = ref(false);
const likeCount = ref(props.likes_count);
const showComments = ref(false);
const newComment = ref('');
const postComments = ref([]);
const commentCount = ref(props.comments_count);
const commentsLoading = ref(false);

onMounted(async () => {
  // Fetch user's like status
  try {
    const response = await fetch(`${config.SERVER_URL}/post_likes/${props.post_id}/is_liked`, {
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

async function likePost() {
  try {
    const response = await fetch(`${config.SERVER_URL}/post_likes/${props.post_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })

    if (response.ok) {
      hasLiked.value = true;
      likeCount.value++;
    } else {
      const data = await response.json();
      alert(`Post Like failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeLikeFromPost() {
  try {
    const response = await fetch(`${config.SERVER_URL}/post_likes/${props.post_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })

    if (response.ok) {
      hasLiked.value = false;
      likeCount.value = Math.max(0, likeCount.value - 1);
    } else {
      const data = await response.json();
      alert(`Post Unlike failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function toggleComments() {
  showComments.value = !showComments.value;
  if (showComments.value && postComments.value.length === 0) {
    await fetchComments();
  }
}

async function fetchComments() {
  commentsLoading.value = true;
  try {
    const response = await fetch(`${config.SERVER_URL}/comments/${props.post_id}`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });
    if (response.ok) {
      postComments.value = await response.json();
    } else {
      alert('Failed to fetch comments.');
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
  } finally {
    commentsLoading.value = false;
  }
}

async function handleCommentSubmit() {
  if (!newComment.value.trim()) {
    alert('Please enter a comment.');
    return;
  }

  try {
    const payload = {
      content: newComment.value,
    };

    const response = await fetch(`${config.SERVER_URL}/comments/${props.post_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      newComment.value = '';
      commentCount.value++;
      await fetchComments();
    } else {
      const data = await response.json();
      alert(`Failed to create comment: ${data.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <a-card hoverable style="position: relative;">

    <div class="top-actions">
      <EditOutlined class="action-icon" key="edit" v-can="{ role: ['admin'], ownerId: user_id }"
        @click="isEditing = !isEditing" />
      <DeleteOutlined class="action-icon delete-icon" key="delete" v-can="{ role: ['admin'], ownerId: user_id }"
        @click="deletePost" />
    </div>

    <div class="card-header">
      <h4 class="username-title">{{ username }}</h4>
    </div>

    <div class="card-content">
      <div v-if="!isEditing">
        <p>{{ content }}</p>
      </div>
      <div v-else>
        <a-textarea v-model:value="editContent" :rows="3" style="margin-bottom: 10px;" />
        <a-button type="primary" size="small" @click="handleEdit">Save</a-button>
        <a-button size="small" style="margin-left: 8px;" @click="isEditing = false">Cancel</a-button>
      </div>
      <small style="color: gray; display: block; margin-bottom: 12px;">Posted: {{ new Date(created_at).toLocaleString()
      }}</small>
    </div>

    <div class="card-image" v-if="imageURL">
      <img :alt="username + ' post image'" :src="imageURL" />
    </div>

    <div class="stats-row" v-if="likeCount > 0 || commentCount > 0">
      <div v-if="likeCount > 0" style="display: flex; align-items: center;">
        <LikeFilled style="color: #1890ff; margin-right: 6px;" />
        <span class="stats-text">{{ likeCount }} {{ likeCount === 1 ? 'Like' : 'Likes' }}</span>
      </div>
      <div v-if="commentCount > 0" style="margin-left: auto;">
        <span class="stats-text" style="color: #666; font-size: 13px;">{{ commentCount }} {{ commentCount === 1 ? 'Comment' : 'Comments' }}</span>
      </div>
    </div>

    <template #actions>
      <!-- We need a single root wrapper inside the action slot, otherwise Ant Design maps loops over them incorrectly -->
      <div v-if="hasLiked" class="action-btn liked-active" @click="removeLikeFromPost">
        <LikeFilled />
        <span class="action-text">Liked</span>
      </div>
      <div v-else class="action-btn" @click="likePost">
        <LikeOutlined />
        <span class="action-text">Like</span>
      </div>

      <div class="action-btn" @click="toggleComments">
        <CommentOutlined />
        <span class="action-text">Comment</span>
      </div>
    </template>
    <div v-if="showComments" class="comments-section">
      <div v-if="commentsLoading">Loading comments...</div>
      <CommentCard v-else v-for="comment in postComments" :key="comment.id" :username="comment.username"
        :comment="comment.content" :comment_id="comment.id" :user_id="comment.user_id" :likes_count="comment.likes_count" />
      <div class="comment-form">
        <a-input v-model:value="newComment" placeholder="Add a comment..." @keyup.enter="handleCommentSubmit"/>
        <a-button @click="handleCommentSubmit" type="primary">Submit</a-button>
      </div>
    </div>
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

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #555;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #1890ff;
}

.liked-active {
  color: #1890ff;
}

.action-text {
  font-size: 14px;
}

.card-header {
  padding: 16px 24px 0 24px;
}

.username-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-content {
  padding: 12px 24px;
}

.card-content p {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.stats-row {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}

.stats-text {
  font-size: 13px;
  color: #666;
}

.card-image {
  width: 100%;
}

.card-image img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.comments-section {
  padding: 0 24px 12px;
  margin-top: 16px;
}

.comment-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

:deep(.ant-card-body) {
  padding: 0 !important;
}
</style>
