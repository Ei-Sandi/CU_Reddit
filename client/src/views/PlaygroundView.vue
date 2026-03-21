<script setup>
import { ref, watch } from 'vue'

const note = ref('')
const saveStatus = ref('Waiting for input...')
let timeoutId = null

// Watch the 'note' variable
watch(note, (newValue, oldValue) => {
  saveStatus.value = 'Typing...'
  
  // Clear the previous timer if they are still typing
  if (timeoutId) clearTimeout(timeoutId)
  
  // Set a new timer. If they stop typing for 1 second, "save" it.
  timeoutId = setTimeout(() => {
    saveStatus.value = 'Saved securely to cloud!'
    console.log('Sending to API:', newValue) // Simulate API call
  }, 1000)
})
</script>

<template>
  <div style="padding: 50px;">
    <h2>Auto-Save Notepad</h2>
    <p>Status: <strong>{{ saveStatus }}</strong></p>
    
    <input 
      v-model="note" 
      type="text" 
      style="width: 300px; padding: 8px;" 
    />
  </div>
</template>

