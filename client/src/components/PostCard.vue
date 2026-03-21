<script setup>
import { Card } from 'ant-design-vue';

// Define what data this component EXPECTS to receive
defineProps({
  title: String,
  summary: String,
  imageURL: String // In JS, props are optional by default unless you specify { required: true }
})

</script>

<template>
  <a-card hoverable style="width: 300px">
    <template #cover>
      <img :alt="title" :src="imageURL || 'https://picsum.photos/300/200'" />
    </template>
    
    <a-card-meta :title="title">
      <template #description>
        {{ summary }}
      </template>
    </a-card-meta>
  </a-card>
</template>
