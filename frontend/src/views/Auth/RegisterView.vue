<template>
  <v-container fluid class="fill-height d-flex align-center justify-center auth-background">
    <RegisterForm />
  </v-container>
</template>

<script setup>
import RegisterForm from '@/components/Auth/RegisterForm.vue';
</script>

<style scoped>
.auth-background {
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>