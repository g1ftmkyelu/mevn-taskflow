<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 text-center mb-6 text-primary">My Task List</h1>

        <v-card class="mb-6 pa-4 glass-card" elevation="8">
          <TodoForm @submit="handleAddTodo" />
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

        <v-card v-if="!todoStore.loading && todoStore.todos.length === 0" class="pa-6 text-center glass-card">
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
</template>

<script setup>
import { onMounted } from 'vue';
import { useTodoStore } from '@/stores/todo';
import TodoForm from '@/components/Todo/TodoForm.vue';
import TodoItem from '@/components/Todo/TodoItem.vue';

const todoStore = useTodoStore();

onMounted(() => {
  todoStore.fetchTodos();
});

const handleAddTodo = async (newTodo) => {
  const success = await todoStore.addTodo(newTodo);
  if (success) {
    // Optionally clear form or show success message
  }
};
</script>

<style scoped>
.v-container {
  background: linear-gradient(to bottom right, #e0f2f7, #bbdefb);
  min-height: calc(100vh - 64px - 64px); /* Adjust for header and footer height */
}
</style>