<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <h1 class="text-h4 text-center mb-6 text-primary">Manage Categories</h1>
        <CategoryTable />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CategoryTable from '@/components/Category/CategoryTable.vue';
import { useCategoryStore } from '@/stores/category';

const categoryStore = useCategoryStore();
</script>

<style scoped>
.v-container {
  /* Background color is now managed by Vuetify theme */
  min-height: calc(100vh - 64px - 64px);
}
</style>