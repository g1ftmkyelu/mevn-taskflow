<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="localCategory.name"
      label="Category Name"
      prepend-inner-icon="mdi-tag"
      variant="outlined"
      :rules="[rules.required, rules.min(1), rules.max(50)]"
      class="mb-4"
      clearable
    ></v-text-field>

    <v-btn
      type="submit"
      color="primary"
      size="large"
      block
      :loading="categoryStore.loading"
      class="text-capitalize"
    >
      {{ isEdit ? 'Update Category' : 'Add Category' }}
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { required, minLength, maxLength } from '@/utils/validationRules';

const props = defineProps({
  category: {
    type: Object,
    default: () => ({
      name: ''
    })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

const categoryStore = useCategoryStore();

const localCategory = ref({ ...props.category });

watch(() => props.category, (newVal) => {
  localCategory.value = { ...newVal };
}, { deep: true });

const rules = {
  required: value => required(value),
  min: len => value => minLength(value, len),
  max: len => value => maxLength(value, len)
};

const submitForm = async () => {
  categoryStore.clearError();
  emit('submit', localCategory.value);
};
</script>