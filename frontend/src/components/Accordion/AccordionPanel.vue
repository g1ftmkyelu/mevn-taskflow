<template>
  <v-expansion-panel class="glass-card mb-4" color="surface" elevation="4">
    <v-expansion-panel-title class="text-h6 text-primary">
      <v-icon start>{{ icon }}</v-icon>
      {{ title }}
    </v-expansion-panel-title>
    <v-expansion-panel-text class="pa-4">
      <slot></slot>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'mdi-information'
  }
});
</script>

<style scoped>
/* Glass card styles are now handled globally in main.css and via Vuetify props */
</style>