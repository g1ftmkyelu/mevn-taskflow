<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card class="glass-card pa-4">
      <v-card-title class="text-h5 text-center mb-4">
        {{ isEdit ? 'Edit Todo' : 'Add New Todo' }}
      </v-card-title>
      <v-card-text>
        <v-alert v-if="todoStore.error" type="error" dismissible class="mb-4">
          {{ todoStore.error }}
        </v-alert>
        <TodoForm
          :todo="todo"
          :is-edit="isEdit"
          @submit="handleSubmit"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="secondary" variant="text" @click="closeDialog" :disabled="todoStore.loading">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';
import TodoForm from '@/components/Todo/TodoForm.vue';
import { useTodoStore } from '@/stores/todo';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  todo: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      completed: false,
      dueDate: null
    })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const todoStore = useTodoStore();

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const handleSubmit = (todoData) => {
  emit('submit', todoData);
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