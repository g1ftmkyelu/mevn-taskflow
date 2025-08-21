<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 text-center mb-6 text-primary">Manage Categories</h1>
        <CategoryTable />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CategoryTable from '@/components/Category/CategoryTable.vue';
import { useCategoryStore } from '@/stores/category'; // Keep this import as it's used by CategoryTable

const categoryStore = useCategoryStore(); // Keep this line, though it's not directly used in this file after the change, it's part of the setup.
</script>

<style scoped>
.v-container {
  background-color: #F1F8E9;
  min-height: calc(100vh - 64px - 64px);
}
</style>