<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="localTodo.title"
      label="Title"
      prepend-inner-icon="mdi-format-title"
      variant="outlined"
      :rules="[rules.required, rules.min(1)]"
      class="mb-4"
      clearable
    ></v-text-field>
    <v-textarea
      v-model="localTodo.description"
      label="Description (Optional)"
      prepend-inner-icon="mdi-text-box-outline"
      variant="outlined"
      rows="3"
      class="mb-4"
      clearable
    ></v-textarea>
    <v-menu
      v-model="datePickerMenu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-model="formattedDueDate"
          label="Due Date (Optional)"
          prepend-inner-icon="mdi-calendar"
          variant="outlined"
          readonly
          v-bind="props"
          clearable
          @click:clear="localTodo.dueDate = null"
          class="mb-4"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="localTodo.dueDate"
        @update:model-value="datePickerMenu = false"
        color="primary"
      ></v-date-picker>
    </v-menu>

    <v-checkbox
      v-if="isEdit"
      v-model="localTodo.completed"
      label="Completed"
      color="primary"
      class="mb-4"
    ></v-checkbox>

    <v-btn
      type="submit"
      color="primary"
      size="large"
      block
      :loading="todoStore.loading"
      class="text-capitalize"
    >
      {{ isEdit ? 'Update Todo' : 'Add Todo' }}
    </v-btn>
    <v-btn
      v-if="isEdit"
      color="secondary"
      size="large"
      block
      variant="outlined"
      class="mt-3 text-capitalize"
      @click="$router.back()"
    >
      Cancel
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTodoStore } from '@/stores/todo';
import { required, minLength } from '@/utils/validationRules';

const props = defineProps({
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

const emit = defineEmits(['submit']);

const todoStore = useTodoStore();

const localTodo = ref({ ...props.todo });
const datePickerMenu = ref(false);

// Watch for changes in props.todo when in edit mode to update localTodo
watch(() => props.todo, (newVal) => {
  localTodo.value = { ...newVal };
}, { deep: true });

const formattedDueDate = computed(() => {
  if (!localTodo.value.dueDate) return '';
  const date = new Date(localTodo.value.dueDate);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
});

const rules = {
  required: value => required(value),
  min: len => value => minLength(value, len)
};

const submitForm = async () => {
  todoStore.clearError();
  emit('submit', localTodo.value);
};
</script>

<style scoped>
/* No specific card styling here, as this component is now meant to be wrapped by a modal or card */
</style>