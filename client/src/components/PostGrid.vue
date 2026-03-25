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

  <a-row :gutter="[16, 16]" v-else>

    <a-col :span="8" v-for="post in posts" :key="post.post_id">
      <PostCard :username="post.username" :content="post.content" :created_at="post.created_at" :imageURL="post.image_url" />
    </a-col>

  </a-row>
</template>
