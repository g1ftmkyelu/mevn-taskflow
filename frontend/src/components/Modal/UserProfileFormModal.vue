<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card class="glass-card pa-4">
      <v-card-title class="text-h5 text-center mb-4">
        Edit Profile
      </v-card-title>
      <v-card-text>
        <v-alert v-if="authStore.error" type="error" dismissible class="mb-4">
          {{ authStore.error }}
        </v-alert>
        <UserProfileForm
          :user="user"
          @submit="handleSubmit"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="secondary" variant="text" @click="closeDialog" :disabled="authStore.loading">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';
import UserProfileForm from '@/components/User/UserProfileForm.vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({ username: '', email: '' })
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const authStore = useAuthStore();

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const handleSubmit = (userData) => {
  emit('submit', userData);
};

const closeDialog = () => {
  emit('close');
  dialog.value = false;
};
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