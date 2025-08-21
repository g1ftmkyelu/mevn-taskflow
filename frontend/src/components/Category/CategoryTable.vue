<template>
  <v-card class="glass-card pa-4" elevation="8">
    <v-card-title class="d-flex align-center justify-space-between">
      Categories
      <v-btn color="primary" @click="openAddModal" prepend-icon="mdi-plus" class="text-capitalize">
        Add Category
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="categoryStore.error" type="error" dismissible class="mb-4">
        {{ categoryStore.error }}
      </v-alert>

      <v-progress-linear
        v-if="categoryStore.loading"
        indeterminate
        color="primary"
        class="mb-4"
      ></v-progress-linear>

      <v-data-table
        v-if="!categoryStore.loading && categoryStore.categories.length > 0"
        :headers="headers"
        :items="categoryStore.categories"
        item-value="_id"
        class="elevation-1"
        :items-per-page="5"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            size="small"
            class="me-2"
            @click="openEditModal(item.raw)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            @click="confirmDelete(item.raw)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-alert type="info" class="mt-4">No categories found. Click "Add Category" to create one.</v-alert>
        </template>
      </v-data-table>
      <v-card v-else-if="!categoryStore.loading && categoryStore.categories.length === 0" class="pa-6 text-center glass-card">
        <v-icon size="64" color="grey-lighten-1">mdi-tag-multiple</v-icon>
        <p class="text-h6 mt-4 text-grey-darken-1">No categories found. Click "Add Category" to create one!</p>
      </v-card>
    </v-card-text>
  </v-card>

  <CategoryFormModal
    v-model="categoryModalOpen"
    :category="selectedCategory"
    :is-edit="isEditMode"
    @submit="handleCategorySubmit"
    @close="closeModal"
  />

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirm Deletion</v-card-title>
      <v-card-text>Are you sure you want to delete category "{{ categoryToDelete?.name }}"?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="deleteCategory">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import CategoryFormModal from '@/components/Modal/CategoryFormModal.vue';

const categoryStore = useCategoryStore();

const categoryModalOpen = ref(false);
const selectedCategory = ref(null);
const isEditMode = ref(false);
const deleteDialog = ref(false);
const categoryToDelete = ref(null);

const headers = [
  { title: 'Category Name', key: 'name' },
  { title: 'Created At', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleDateString() },
  { title: 'Actions', key: 'actions', sortable: false },
];

onMounted(() => {
  categoryStore.fetchCategories();
});

const openAddModal = () => {
  selectedCategory.value = { name: '' };
  isEditMode.value = false;
  categoryModalOpen.value = true;
};

const openEditModal = (category) => {
  selectedCategory.value = { ...category };
  isEditMode.value = true;
  categoryModalOpen.value = true;
};

const handleCategorySubmit = async (categoryData) => {
  let success;
  if (isEditMode.value) {
    success = await categoryStore.updateCategory(selectedCategory.value._id, categoryData);
  } else {
    success = await categoryStore.addCategory(categoryData);
  }
  if (success) {
    closeModal();
  }
};

const confirmDelete = (category) => {
  categoryToDelete.value = category;
  deleteDialog.value = true;
};

const deleteCategory = async () => {
  if (categoryToDelete.value) {
    await categoryStore.deleteCategory(categoryToDelete.value._id);
    deleteDialog.value = false;
    categoryToDelete.value = null;
  }
};

const closeModal = () => {
  categoryModalOpen.value = false;
  selectedCategory.value = null;
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