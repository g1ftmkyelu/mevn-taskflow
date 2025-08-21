<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 text-center mb-6 text-primary">My Task List</h1>

        <v-card class="mb-6 pa-4 glass-card" elevation="8" color="surface">
          <v-card-title class="text-h6 d-flex justify-space-between align-center">
            Add New Task
            <v-btn color="primary" @click="openAddTodoModal" prepend-icon="mdi-plus" class="text-capitalize">
              Add Task
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p class="text-body-2 text-grey-darken-1">Click the button above to add a new task.</p>
          </v-card-text>
        </v-card>

        <v-alert v-if="todoStore.error" type="error" dismissible class="mb-4">
          {{ todoStore.error }}
        </v-alert>

        <v-progress-linear
          v-if="todoStore.loading"
          indeterminate
          color="primary"
          class="mb-4"
        ></v-progress-linear>

        <v-card v-if="!todoStore.loading && todoStore.todos.length === 0" class="pa-6 text-center glass-card" color="surface">
          <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
          <p class="text-h6 mt-4 text-grey-darken-1">No tasks found. Start by adding a new one!</p>
        </v-card>

        <div v-else>
          <TodoItem
            v-for="todo in todoStore.todos"
            :key="todo._id"
            :todo="todo"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>

  <TodoFormModal
    v-model="todoModalOpen"
    :todo="selectedTodo"
    :is-edit="isEditMode"
    @submit="handleTodoSubmit"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todo';
import TodoItem from '@/components/Todo/TodoItem.vue';
import TodoFormModal from '@/components/Modal/TodoFormModal.vue';

const todoStore = useTodoStore();

const todoModalOpen = ref(false);
const selectedTodo = ref(null);
const isEditMode = ref(false);

onMounted(() => {
  todoStore.fetchTodos();
});

const openAddTodoModal = () => {
  selectedTodo.value = { title: '', description: '', completed: false, dueDate: null };
  isEditMode.value = false;
  todoModalOpen.value = true;
};

const handleTodoSubmit = async (todoData) => {
  let success;
  if (isEditMode.value) {
    // This path is typically handled by TodoEditView, but keeping it for consistency if needed
    success = await todoStore.updateTodo(selectedTodo.value._id, todoData);
  } else {
    success = await todoStore.addTodo(todoData);
  }
  if (success) {
    closeModal();
  }
};

const closeModal = () => {
  todoModalOpen.value = false;
  selectedTodo.value = null;
};
</script>

<style scoped>
.v-container {
  /* Background color is now managed by Vuetify theme */
  min-height: calc(100vh - 64px - 64px); /* Adjust for header and footer height */
}
/* Glass card styles are now handled globally in main.css and via Vuetify props */
</style>