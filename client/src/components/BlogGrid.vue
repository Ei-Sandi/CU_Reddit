<script setup>
import { ref, onMounted } from 'vue'
import PostCard from './PostCard.vue'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/posts')
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
      <PostCard 
        :username="post.username"
        :content="post.content" 
      />
    </a-col>
    
  </a-row>
</template>

