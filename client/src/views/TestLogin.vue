<script setup>
let isLoggedIn = false;
function login() {
    isLoggedIn = true;
    alert("Logged in! Variable is now true.");
}
</script>
<template>
    <button @click="login">Login</button>
    <p v-if="isLoggedIn">You are logged in.</p>
</template>

