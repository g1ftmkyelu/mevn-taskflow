<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="localUser.username"
      label="Username"
      prepend-inner-icon="mdi-account"
      variant="outlined"
      :rules="[rules.required, rules.min(3), rules.max(30)]"
      class="mb-4"
      clearable
    ></v-text-field>
    <v-text-field
      v-model="localUser.email"
      label="Email"
      type="email"
      prepend-inner-icon="mdi-email"
      variant="outlined"
      :rules="[rules.required, rules.email]"
      class="mb-4"
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
      Update Profile
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { required, email, minLength, maxLength } from '@/utils/validationRules';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ username: '', email: '' })
  }
});

const emit = defineEmits(['submit']);

const authStore = useAuthStore();

const localUser = ref({ ...props.user });

watch(() => props.user, (newVal) => {
  localUser.value = { ...newVal };
}, { deep: true });

const rules = {
  required: value => required(value),
  email: value => email(value),
  min: len => value => minLength(value, len),
  max: len => value => maxLength(value, len)
};

const submitForm = async () => {
  authStore.clearError();
  emit('submit', localUser.value);
};
</script>