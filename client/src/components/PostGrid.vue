<script setup>
import { ref, onMounted } from 'vue'
import PostCard from './PostCard.vue'
import { config } from '../config.js'
import { useUserStore } from '../stores/user.js'

const posts = ref([])
const loading = ref(true)
const userStore = useUserStore()
const page = ref(1)
const hasMore = ref(true)
const fetchingMore = ref(false)

const props = defineProps({
  user_id: [String, Number]
})

const fetchPosts = async (reset = false) => {
  if (reset) {
    page.value = 1
    posts.value = []
    hasMore.value = true
  }

  try {
    loading.value = reset;
    fetchingMore.value = !reset;

    let url = props.user_id 
      ? `${config.SERVER_URL}/posts/${props.user_id}`
      : `${config.SERVER_URL}/posts`;
      
    url += `?page=${page.value}&limit=5`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })

    const data = await res.json()
    
    if (data.length < 5) {
      hasMore.value = false
    }

    if (reset) {
      posts.value = data
    } else {
      posts.value = [...posts.value, ...data]
    }

  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    fetchingMore.value = false
  }
}

const loadMore = () => {
  if (!fetchingMore.value && hasMore.value) {
    page.value++
    fetchPosts()
  }
}

onMounted(() => {
  fetchPosts(true)
})
</script>

<template>
  <div v-if="loading" style="text-align: center; margin: 20px;">Loading...</div>

  <div v-else>
    <a-row :gutter="[16, 16]" justify="center">
      <a-col :span="24" v-for="post in posts" :key="post.post_id" style="display: flex; justify-content: center;">
        <PostCard :post_id="post.post_id" :username="post.username" :content="post.content" :created_at="post.created_at" 
        :imageURL="post.image_url" :user_id="post.user_id" :likes_count="post.likes_count" :comments_count="post.comments_count" style="width: 100%; max-width: 600px;" />
      </a-col>
    </a-row>
    
    <div style="text-align: center; margin-top: 20px; padding-bottom: 30px;">
      <a-button v-if="hasMore" type="primary" :loading="fetchingMore" @click="loadMore">
        Load More
      </a-button>
      <span v-else style="color: gray;">No more posts to show.</span>
    </div>
  </div>
</template>
