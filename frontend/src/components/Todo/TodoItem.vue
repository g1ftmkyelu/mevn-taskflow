<template>
  <v-card
    class="mb-4 pa-4 glass-card d-flex align-center justify-space-between"
    :class="{ 'completed-todo': todo.completed }"
    elevation="4"
  >
    <div class="d-flex align-center flex-grow-1">
      <v-checkbox-btn
        v-model="localCompleted"
        @change="toggleCompleted"
        color="primary"
        class="mr-2"
      ></v-checkbox-btn>
      <div class="flex-grow-1">
        <v-card-title class="text-h6 pa-0" :class="{ 'text-decoration-line-through': todo.completed }">
          {{ todo.title }}
        </v-card-title>
        <v-card-subtitle class="pa-0 text-wrap">
          {{ todo.description }}
        </v-card-subtitle>
        <v-chip
          v-if="todo.dueDate"
          :color="isOverdue ? 'error' : 'info'"
          size="small"
          class="mt-2"
          label
        >
          <v-icon start icon="mdi-calendar"></v-icon>
          {{ formattedDueDate }}
        </v-chip>
      </div>
    </div>
    <v-card-actions class="pa-0">
      <v-btn icon variant="text" color="secondary" @click="editTodo">
        <v-icon>mdi-pencil</v-icon>
        <v-tooltip activator="parent" location="top">Edit Todo</v-tooltip>
      </v-btn>
      <v-btn icon variant="text" color="error" @click="confirmDelete">
        <v-icon>mdi-delete</v-icon>
        <v-tooltip activator="parent" location="top">Delete Todo</v-tooltip>
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirm Deletion</v-card-title>
      <v-card-text>Are you sure you want to delete "{{ todo.title }}"?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="deleteTodo">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTodoStore } from '@/stores/todo';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const todoStore = useTodoStore();
const deleteDialog = ref(false);

const localCompleted = ref(props.todo.completed);

const formattedDueDate = computed(() => {
  if (!props.todo.dueDate) return '';
  const date = new Date(props.todo.dueDate);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
});

const isOverdue = computed(() => {
  if (props.todo.completed || !props.todo.dueDate) return false;
  const dueDate = new Date(props.todo.dueDate);
  return dueDate < new Date();
});

const toggleCompleted = async () => {
  await todoStore.updateTodo(props.todo._id, { completed: localCompleted.value });
};

const editTodo = () => {
  router.push({ name: 'edit-todo', params: { id: props.todo._id } });
};

const confirmDelete = () => {
  deleteDialog.value = true;
};

const deleteTodo = async () => {
  await todoStore.deleteTodo(props.todo._id);
  deleteDialog.value = false;
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Softer hover shadow */
}

.completed-todo {
  opacity: 0.7;
  /* Removed background tint for a more minimal look */
}

.text-decoration-line-through {
  text-decoration: line-through;
  color: #757575; /* Muted color for completed text */
}
</style>