<template>
  <v-app>
    <AppHeader v-if="shouldShowHeader" />
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/Layout/AppHeader.vue';

const route = useRoute();

const shouldShowHeader = computed(() => {
  return route.name !== 'login' && route.name !== 'register';
});
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