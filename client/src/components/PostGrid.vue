<script setup>
import { ref, onMounted } from 'vue'
import PostCard from './PostCard.vue'
import { config } from '../config.js'
import { useUserStore } from '../stores/user.js'

const posts = ref([])
const loading = ref(true)
const userStore = useUserStore()

const props = defineProps({
  user_id: [String, Number]
})

onMounted(async () => {
  try {
    const url = props.user_id 
      ? `${config.SERVER_URL}/posts/${props.user_id}`
      : `${config.SERVER_URL}/posts`;

    const res = await fetch(url, {
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

  <a-row :gutter="[16, 16]" v-else justify="center">

    <a-col :span="24" v-for="post in posts" :key="post.post_id" style="display: flex; justify-content: center;">
      <PostCard :post_id="post.post_id" :username="post.username" :content="post.content" :created_at="post.created_at" 
      :imageURL="post.image_url" :user_id="post.user_id" :likes_count="post.likes_count" style="width: 100%; max-width: 600px;" />
    </a-col>

  </a-row>
</template>
