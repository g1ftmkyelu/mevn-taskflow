<template>
  <v-card class="pa-6 glass-card" elevation="12" max-width="450" width="100%">
    <v-card-title class="text-h5 text-center mb-4">Register for TaskFlow</v-card-title>
    <v-card-text>
      <v-alert v-if="authStore.error" type="error" dismissible class="mb-4">
        {{ authStore.error }}
      </v-alert>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="username"
          label="Username"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          :rules="[rules.required, rules.min(3)]"
          class="mb-4"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="registerEmail"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          :rules="[rules.required, rules.email]"
          class="mb-4"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          :rules="[rules.required, rules.min(6)]"
          class="mb-4"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          prepend-inner-icon="mdi-lock-check"
          variant="outlined"
          :rules="[rules.required, rules.confirmPassword(password)]"
          class="mb-6"
          clearable
        ></v-text-field>
        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :loading="authStore.loading"
          class="text-capitalize"
        >
          Register
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn variant="text" color="secondary" @click="$router.push('/login')">
        Already have an account? Login
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { required, email, minLength, confirmed } from '@/utils/validationRules';

const authStore = useAuthStore();

const username = ref('');
const registerEmail = ref('');
const password = ref('');
const confirmPassword = ref('');

const rules = {
  required: value => required(value),
  email: value => email(value),
  min: len => value => minLength(value, len),
  confirmPassword: passwordToConfirm => value => confirmed(value, passwordToConfirm)
};

const submitForm = async () => {
  authStore.clearError();
  const success = await authStore.register(username.value, registerEmail.value, password.value);
  if (success) {
    // Form fields are cleared by router push
  }
};
</script>

<style scoped>
.v-card {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>