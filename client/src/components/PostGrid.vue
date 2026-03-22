<script setup>
import { ref, onMounted } from 'vue'
import PostCard from './PostCard.vue'
import { config } from '../config.js'
import { useUserStore } from '../stores/user.js'

const posts = ref([])
const loading = ref(true)
const userStore = useUserStore()

onMounted(async () => {
  try {
    const res = await fetch(`${config.SERVER_URL}/posts`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    const data = await res.json()
    posts.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading">Loading...</div>

  <a-row :gutter="[16, 16]" v-else>

    <a-col :span="8" v-for="post in posts" :key="post.post_id">
      <PostCard :username="post.username" :content="post.content" :created_at="post.created_at" />
    </a-col>

  </a-row>
</template>
