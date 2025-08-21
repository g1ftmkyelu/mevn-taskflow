<template>
  <v-container fluid class="fill-height d-flex align-center justify-center not-found-background">
    <v-card class="pa-8 text-center glass-card" elevation="12" max-width="600">
      <v-icon size="128" color="error">mdi-alert-circle-outline</v-icon>
      <h1 class="text-h3 mt-4 mb-2 text-error">404 - Page Not Found</h1>
      <p class="text-h6 text-grey-darken-1 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <v-btn color="primary" size="large" to="/" class="text-capitalize">
        <v-icon start>mdi-home</v-icon>
        Go to Home
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
// No script logic needed for a static 404 page
</script>

<style scoped>
.not-found-background {
  background-color: #F5F5F5; /* Solid very light grey background */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-card {
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
</style>