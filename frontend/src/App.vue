<template>
  <v-app>
    <AppHeader />
    <v-main>
      <v-container fluid class="pa-0">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import AppHeader from '@/components/Layout/AppHeader.vue';
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* General transitions for interactive elements */
.v-btn, .v-card, .v-list-item {
  transition: all 0.3s ease-in-out;
}
</style>