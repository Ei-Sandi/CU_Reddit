<script setup>

defineProps({
  username: String,
  content: String,
  created_at: String
  //imageURL: String 
})

</script>

<template>
  <a-card hoverable style="width: 300px">
    <!-- <template #cover>
      <img :alt="title" :src="imageURL || 'https://picsum.photos/300/200'" />
    </template> -->

    <a-card-meta :title="username">
      <template #description>
        <p>{{ content }}</p>
        <small style="color: gray;">Posted: {{ new Date(created_at).toLocaleString() }}</small>
      </template>
    </a-card-meta>
  </a-card>
</template>
