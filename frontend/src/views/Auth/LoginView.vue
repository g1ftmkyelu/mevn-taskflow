<template>
  <v-container fluid class="fill-height d-flex align-center justify-center auth-background">
    <LoginForm />
  </v-container>
</template>

<script setup>
import LoginForm from '@/components/Auth/LoginForm.vue';
</script>

<style scoped>
.auth-background {
  background-color: #F1F8E9; /* Solid light green background */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>