<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PostGrid from '../components/PostGrid.vue'
import { useUserStore } from '@/stores/user';
import { EditOutlined, CheckOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons-vue';
import { config } from '@/config';

const router = useRouter();
const userStore = useUserStore();
const isEditing = ref(false);
const editName = ref(userStore.user.username);

async function saveUsername() {
  if (!editName.value.trim() || editName.value === userStore.user.username) {
    isEditing.value = false;
    return;
  }

  try {
    const res = await fetch(`${config.SERVER_URL}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ username: editName.value })
    });

    if (res.ok) {
      userStore.user.username = editName.value;
      localStorage.setItem('user', JSON.stringify(userStore.user));
      isEditing.value = false;
      alert("Username updated successfully!");
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`Update failed: ${data.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error(err);
  }
}

function cancelEdit() {
  editName.value = userStore.user.username;
  isEditing.value = false;
}

async function deleteAccount() {
  if (!confirm("Are you VERY sure you want to delete your account? This action is permanent and will delete all your posts and comments!")) {
    return;
  }

  try {
    const res = await fetch(`${config.SERVER_URL}/users/${userStore.user.ID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (res.ok) {
      alert("Account deleted.");
      userStore.logout();
      router.push('/');
    } else {
      const data = await res.json();
      alert(`Deletion failed: ${data.error || 'Unknown error'}`);
    }
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <div class="user-greeting">
    <div class="greeting-text">
      <div v-if="!isEditing" style="display: flex; align-items: baseline; gap: 10px;">
        <h2>{{ userStore.user.username }}</h2>
        <EditOutlined @click="isEditing = true" class="icon-btn edit-icon" />
      </div>
      <div v-else style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <a-input v-model:value="editName" size="large" style="width: 200px;" @pressEnter="saveUsername" />
        <CheckOutlined @click="saveUsername" class="icon-btn save-icon" />
        <CloseOutlined @click="cancelEdit" class="icon-btn cancel-icon" />
      </div>
    </div>
    
    <a-button danger type="primary" class="delete-account-btn" @click="deleteAccount">
      <template #icon><DeleteFilled /></template>
      Delete Account
    </a-button>
  </div>

  <h3 class="section-title">All Posts</h3>
  <PostGrid :user_id="userStore.user.ID" />
</template>

<style scoped>
.user-greeting {
  margin-bottom: 30px;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.delete-account-btn {
  margin-top: 5px;
  background-color: #842025;
  border-color: #842025;
}

.delete-account-btn:hover,
.delete-account-btn:focus {
  background-color: #d3232b;
  border-color: #d3232b ;
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

.icon-btn {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
}

.icon-btn:hover {
  transform: scale(1.2);
}

.edit-icon {
  color: #1890ff;
}

.save-icon {
  color: #52c41a;
  font-size: 22px;
}

.cancel-icon {
  color: #ff4d4f;
  font-size: 22px;
}
</style>
