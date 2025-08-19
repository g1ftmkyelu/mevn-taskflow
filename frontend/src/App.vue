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
    <AppFooter />
  </v-app>
</template>

<script setup>
import AppHeader from '@/components/Layout/AppHeader.vue';
import AppFooter from '@/components/Layout/AppFooter.vue';
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Glassmorphism effect base */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

/* General transitions for interactive elements */
.v-btn, .v-card, .v-list-item {
  transition: all 0.3s ease-in-out;
}
</style>