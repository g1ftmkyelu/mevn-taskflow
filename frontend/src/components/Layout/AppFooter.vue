<template>
  <v-footer app class="bg-primary text-white py-4">
    <v-container class="d-flex flex-column flex-md-row align-center justify-space-between">
      <div class="text-center text-md-left mb-2 mb-md-0">
        &copy; {{ new Date().getFullYear() }} MEVN TaskFlow. All rights reserved.
      </div>
      <div class="d-flex justify-center">
        <v-btn
          icon
          variant="text"
          href="https://github.com/your-repo-link"
          target="_blank"
          rel="noopener noreferrer"
          class="mx-1"
        >
          <v-icon>mdi-github</v-icon>
          <v-tooltip activator="parent" location="top">GitHub Repository</v-tooltip>
        </v-btn>
        <v-btn
          icon
          variant="text"
          href="https://www.linkedin.com/in/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          class="mx-1"
        >
          <v-icon>mdi-linkedin</v-icon>
          <v-tooltip activator="parent" location="top">LinkedIn Profile</v-tooltip>
        </v-btn>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
// No script logic needed for a static footer
</script>

<style scoped>
.v-footer {
  background-color: #424242; /* New primary color */
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
}
</style>