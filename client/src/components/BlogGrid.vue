
<script setup>
import { ref, onMounted } from 'vue'
import PostCard from './PostCard.vue' // Import our new child component

const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Make sure your Week 2 Backend is running on port
    // 3000!
    const res = await fetch('http://localhost:3000/api/v1/articles')
    const data = await res.json()
    articles.value = data
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
    
    <a-col :span="8" v-for="article in articles" :key="article.ID">
      <PostCard 
        :title="article.title" 
        :summary="article.summary" 
        :imageURL="article.imageURL"
      />
    </a-col>
    
  </a-row>
</template>

