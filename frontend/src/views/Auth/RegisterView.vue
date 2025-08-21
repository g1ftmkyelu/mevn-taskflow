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
  /* Background color is now managed by Vuetify theme */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>