<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 text-center mb-6 text-primary">My Profile</h1>

        <v-card class="glass-card pa-6" elevation="8">
          <v-card-title class="text-h5 text-center mb-4">
            <v-icon size="48" color="primary">mdi-account-circle</v-icon>
            <span class="ml-2">User Details</span>
          </v-card-title>
          <v-card-text>
            <v-list density="compact" class="bg-transparent">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Username:</v-list-item-title>
                <v-list-item-subtitle>{{ authStore.currentUser?.username }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Email:</v-list-item-title>
                <v-list-item-subtitle>{{ authStore.currentUser?.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Member Since:</v-list-item-title>
                <v-list-item-subtitle>{{ formattedCreatedAt }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="openProfileEdit" prepend-icon="mdi-pencil" class="text-capitalize">
              Edit Profile
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <UserProfileFormModal
    v-model="profileModalOpen"
    :user="authStore.currentUser"
    @submit="handleProfileUpdate"
    @close="profileModalOpen = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import UserProfileFormModal from '@/components/Modal/UserProfileFormModal.vue';

const authStore = useAuthStore();
const profileModalOpen = ref(false);

const formattedCreatedAt = computed(() => {
  if (!authStore.currentUser?.createdAt) return 'N/A';
  const date = new Date(authStore.currentUser.createdAt);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

onMounted(() => {
  // Ensure user data is fetched when navigating to the profile page
  if (!authStore.currentUser) {
    authStore.fetchMe();
  }
});

const openProfileEdit = () => {
  authStore.clearError(); // Clear any previous errors
  profileModalOpen.value = true;
};

const handleProfileUpdate = async (userData) => {
  const success = await authStore.updateMe(userData);
  if (success) {
    profileModalOpen.value = false;
  }
};
</script>

<style scoped>
.v-container {
  background-color: #F1F8E9;
  min-height: calc(100vh - 64px - 64px);
}
.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(224, 224, 224, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}
</style>