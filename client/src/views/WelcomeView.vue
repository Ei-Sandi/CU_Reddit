<script setup>

</script>

<template>
    <div class="welcome-container">
        <h1 class="welcome-title">Welcome to CU Reddit.</h1>
        <p class="welcome-subtitle">A place where students can rant about anything uncensored, anonymously and secured.</p>
        <p class="welcome-instruction">Create an account with your university email to get started.</p>
        
        <div class="note-box">
            <p><strong>Note:</strong> Don't use your real name in your username if you want to post completely anonymously.</p>
        </div>
        
        <p class="footer-text">Made by students, for students.</p>
    </div>
</template>

<style scoped>
.welcome-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 40px;
    background-color: #ffffff;
    border: 1px solid #eaeaea;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    text-align: center;
}

.welcome-title {
    color: #001529;
    font-size: 32px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 32px;
    letter-spacing: -0.5px;
}

.welcome-subtitle {
    color: #555555;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 24px;
}

.welcome-instruction {
    color: #333333;
    font-size: 15px;
    margin-bottom: 30px;
}

.note-box {
    background-color: #f8f9fa;
    border-left: 4px solid #001529;
    padding: 16px 20px;
    border-radius: 4px;
    margin: 0 auto 30px auto;
    text-align: left;
    max-width: 90%;
}

.note-box p {
    margin: 0;
    color: #4a4a4a;
    font-size: 14px;
    line-height: 1.5;
}

.footer-text {
    color: #999999;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}
</style>