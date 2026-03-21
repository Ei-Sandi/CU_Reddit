<script setup>

defineProps({
  username: String,
  content: String
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
        {{ content }}
      </template>
    </a-card-meta>
  </a-card>
</template>
