<template>
  <v-expansion-panel class="glass-card mb-4">
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
.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(224, 224, 224, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}
</style>