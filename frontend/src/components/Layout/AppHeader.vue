<template>
  <v-app-bar app color="primary" dark elevation="4">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="font-weight-bold text-h5">
      <router-link to="/" class="text-decoration-none text-white">
        <v-icon class="mr-2">mdi-check-all</v-icon>
        TaskFlow
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="authStore.isAuthenticated" text @click="authStore.logout()" class="text-capitalize">
      <v-icon start>mdi-logout</v-icon>
      Logout
    </v-btn>
    <v-btn v-else text to="/login" class="text-capitalize">
      <v-icon start>mdi-login</v-icon>
      Login
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list-item class="py-4">
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          TaskFlow Menu
        </v-list-item-title>
        <v-list-item-subtitle v-if="authStore.isAuthenticated">
          Hello, {{ authStore.currentUser?.username }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Home" value="home" to="/"></v-list-item>
      <v-list-item
        v-if="authStore.isAuthenticated"
        prepend-icon="mdi-format-list-checks"
        title="My Todos"
        value="todos"
        to="/todos"
      ></v-list-item>
      <v-list-item
        v-if="!authStore.isAuthenticated"
        prepend-icon="mdi-login"
        title="Login"
        value="login"
        to="/login"
      ></v-list-item>
      <v-list-item
        v-if="!authStore.isAuthenticated"
        prepend-icon="mdi-account-plus"
        title="Register"
        value="register"
        to="/register"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const drawer = ref(false);
</script>

<style scoped>
.v-toolbar-title a {
  color: inherit;
  text-decoration: none;
}
</style>