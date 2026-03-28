<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { config } from '../config';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const users = ref([]);
const loading = ref(false);

const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${config.SERVER_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
      },
    });

    if (response.ok) {
      users.value = await response.json();
    } else {
      message.error('Failed to fetch users');
    }
  } catch (error) {
    message.error('An error occurred while fetching users');
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await fetch(`${config.SERVER_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
      },
    });

    if (response.ok) {
      message.success('User deleted successfully');
      fetchUsers();
    } else {
      message.error('Failed to delete user');
    }
  } catch (error) {
    message.error('An error occurred while deleting user');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div style="padding: 20px;">
    <h1>Admin Dashboard</h1>
    <a-table :dataSource="users" :columns="columns" rowKey="ID" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="primary" danger @click="deleteUser(record.ID)">Delete</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
