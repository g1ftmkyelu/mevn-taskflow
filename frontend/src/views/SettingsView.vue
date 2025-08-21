<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 text-center mb-6 text-primary">Settings & Preferences</h1>

        <v-expansion-panels variant="accordion" class="mb-6">
          <AccordionPanel title="General Settings" icon="mdi-cog">
            <p class="text-body-1 mb-4">Manage general application settings.</p>
            <v-switch
              v-model="themeStore.isDark"
              label="Enable Dark Mode"
              color="primary"
              hide-details
              class="mb-2"
              @change="themeStore.toggleTheme(theme)"
            ></v-switch>
            <v-select
              v-model="language"
              :items="['English', 'Spanish', 'French']"
              label="Language (Not Implemented)"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </AccordionPanel>

          <AccordionPanel title="Notification Preferences" icon="mdi-bell">
            <p class="text-body-1 mb-4">Configure how you receive notifications.</p>
            <v-checkbox
              v-model="emailNotifications"
              label="Email Notifications"
              color="primary"
              hide-details
              class="mb-2"
            ></v-checkbox>
            <v-checkbox
              v-model="pushNotifications"
              label="Push Notifications (Not Implemented)"
              color="primary"
              hide-details
              class="mb-2"
            ></v-checkbox>
            <v-slider
              v-model="notificationVolume"
              label="Notification Volume"
              thumb-label
              :min="0"
              :max="100"
              color="primary"
              hide-details
            >
              <template v-slot:append>
                <v-icon>mdi-volume-high</v-icon>
              </template>
            </v-slider>
          </AccordionPanel>

          <AccordionPanel title="Account Management" icon="mdi-account-cog">
            <p class="text-body-1 mb-4">Manage your account details and security.</p>
            <v-btn color="primary" block class="mb-3 text-capitalize" @click="openProfileEdit">
              <v-icon start>mdi-pencil</v-icon>
              Edit Profile Information
            </v-btn>
            <v-btn color="warning" block class="mb-3 text-capitalize">
              <v-icon start>mdi-lock-reset</v-icon>
              Change Password (Not Implemented)
            </v-btn>
            <v-btn color="error" block class="text-capitalize">
              <v-icon start>mdi-delete-forever</v-icon>
              Delete Account (Not Implemented)
            </v-btn>
          </AccordionPanel>

          <AccordionPanel title="About TaskFlow" icon="mdi-information">
            <p class="text-body-1">
              TaskFlow is a simple, robust, and intuitive web application for users to manage their personal to-do lists.
            </p>
            <p class="text-body-2 mt-2 text-grey-darken-1">
              Version: 1.0.0 <br>
              Developed by: AI Software Architect
            </p>
          </AccordionPanel>
        </v-expansion-panels>
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
import { ref } from 'vue';
import AccordionPanel from '@/components/Accordion/AccordionPanel.vue';
import UserProfileFormModal from '@/components/Modal/UserProfileFormModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { useTheme } from 'vuetify'; // Import useTheme

const authStore = useAuthStore();
const themeStore = useThemeStore();
const theme = useTheme(); // Initialize the Vuetify theme composable

const language = ref('English');
const emailNotifications = ref(true);
const pushNotifications = ref(false);
const notificationVolume = ref(75);

const profileModalOpen = ref(false);

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
  /* Background color is now managed by Vuetify theme */
  min-height: calc(100vh - 64px - 64px);
}
</style>