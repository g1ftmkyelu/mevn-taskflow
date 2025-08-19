<template>
  <v-card class="pa-6 glass-card" elevation="12" max-width="450" width="100%">
    <v-card-title class="text-h5 text-center mb-4">Login to TaskFlow</v-card-title>
    <v-card-text>
      <v-alert v-if="authStore.error" type="error" dismissible class="mb-4">
        {{ authStore.error }}
      </v-alert>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="email"
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
          Login
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn variant="text" color="secondary" @click="$router.push('/register')">
        Don't have an account? Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { required, email as validateEmail, minLength } from '@/utils/validationRules';

const authStore = useAuthStore();
const route = useRoute();

const email = ref('');
const password = ref('');

const rules = {
  required: value => required(value),
  email: value => validateEmail(value),
  min: len => value => minLength(value, len)
};

const submitForm = async () => {
  authStore.clearError();
  const success = await authStore.login(email.value, password.value);
  if (success) {
    // Form fields are cleared by router push
  }
};

// Display session expired message if redirected from interceptor
if (route.query.sessionExpired) {
  authStore.error = 'Your session has expired. Please log in again.';
}
</script>

<style scoped>
.v-card {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>