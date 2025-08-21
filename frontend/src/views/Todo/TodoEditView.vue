<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 text-center mb-6 text-primary">Edit Task</h1>

        <v-alert v-if="todoStore.error" type="error" dismissible class="mb-4">
          {{ todoStore.error }}
        </v-alert>

        <v-progress-linear
          v-if="todoStore.loading && !currentTodo"
          indeterminate
          color="primary"
          class="mb-4"
        ></v-progress-linear>

        <v-card v-if="!currentTodo && !todoStore.loading" class="pa-6 text-center glass-card" color="surface">
          <v-icon size="64" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
          <p class="text-h6 mt-4 text-grey-darken-1">Task not found or you don't have access.</p>
          <v-btn color="primary" class="mt-4" @click="$router.push('/todos')">Back to Todos</v-btn>
        </v-card>

        <TodoForm
          v-if="currentTodo"
          :todo="currentTodo"
          :is-edit="true"
          @submit="handleUpdateTodo"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTodoStore } from '@/stores/todo';
import TodoForm from '@/components/Todo/TodoForm.vue';

const route = useRoute();
const router = useRouter();
const todoStore = useTodoStore();

const currentTodo = ref(null);

const fetchTodoDetails = async () => {
  const todoId = route.params.id;
  if (!todoId) {
    router.push({ name: 'not-found' });
    return;
  }

  // Try to get from store first
  let todo = todoStore.getTodoById(todoId);
  if (todo) {
    currentTodo.value = todo;
  } else {
    // If not in store, fetch all todos and then find
    const success = await todoStore.fetchTodos();
    if (success) {
      todo = todoStore.getTodoById(todoId);
      if (todo) {
        currentTodo.value = todo;
      } else {
        // If still not found after fetching, it doesn't exist or is unauthorized
        currentTodo.value = null;
      }
    } else {
      currentTodo.value = null; // Error fetching
    }
  }
};

onMounted(fetchTodoDetails);

// Watch route params for changes (e.g., navigating between edit pages)
watch(() => route.params.id, fetchTodoDetails);

const handleUpdateTodo = async (updatedData) => {
  const success = await todoStore.updateTodo(route.params.id, updatedData);
  if (success) {
    router.push({ name: 'todos' });
  }
};
</script>

<style scoped>
.v-container {
  /* Background color is now managed by Vuetify theme */
  min-height: calc(100vh - 64px - 64px);
}
</style>