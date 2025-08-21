<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card class="glass-card pa-4" color="surface">
      <v-card-title class="text-h5 text-center mb-4">
        {{ isEdit ? 'Edit Category' : 'Add New Category' }}
      </v-card-title>
      <v-card-text>
        <v-alert v-if="categoryStore.error" type="error" dismissible class="mb-4">
          {{ categoryStore.error }}
        </v-alert>
        <CategoryForm
          :category="category"
          :is-edit="isEdit"
          @submit="handleSubmit"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="secondary" variant="text" @click="closeDialog" :disabled="categoryStore.loading">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';
import CategoryForm from '@/components/Category/CategoryForm.vue';
import { useCategoryStore } from '@/stores/category';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  category: {
    type: Object,
    default: () => ({ name: '' })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const categoryStore = useCategoryStore();

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const handleSubmit = (categoryData) => {
  emit('submit', categoryData);
};

const closeDialog = () => {
  emit('close');
  dialog.value = false;
};
</script>

<style scoped>
/* Glass card styles are now handled globally in main.css and via Vuetify props */
</style>