import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import TodoItem from '@/components/Todo/TodoItem.vue';
import TodoForm from '@/components/Todo/TodoForm.vue';
import { useTodoStore } from '@/stores/todo';
import router from '@/router';

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock router push
vi.mock('@/router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    push: vi.fn(),
    back: vi.fn(),
  };
});

describe('Todo Components', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('TodoItem', () => {
    const mockTodo = {
      _id: '60c72b2f9b1d8b001c8e4d7a',
      title: 'Test Todo',
      description: 'This is a test description.',
      completed: false,
      dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'someUserId'
    };

    it('renders todo item correctly', () => {
      const wrapper = mount(TodoItem, {
        props: { todo: mockTodo },
      });

      expect(wrapper.find('.v-card-title').text()).toContain('Test Todo');
      expect(wrapper.find('.v-card-subtitle').text()).toContain('This is a test description.');
      expect(wrapper.find('.v-checkbox-btn').exists()).toBe(true);
      expect(wrapper.find('.v-chip').exists()).toBe(true);
    });

    it('toggles completed status on checkbox change', async () => {
      const todoStore = useTodoStore();
      todoStore.updateTodo = vi.fn().mockResolvedValue(true);

      const wrapper = mount(TodoItem, {
        props: { todo: mockTodo },
      });

      const checkbox = wrapper.find('.v-checkbox-btn input');
      await checkbox.trigger('change');

      expect(todoStore.updateTodo).toHaveBeenCalledWith(mockTodo._id, { completed: true });
    });

    it('navigates to edit page on edit button click', async () => {
      const wrapper = mount(TodoItem, {
        props: { todo: mockTodo },
      });

      await wrapper.find('button[aria-label="Edit Todo"]').trigger('click');
      expect(router.push).toHaveBeenCalledWith({ name: 'edit-todo', params: { id: mockTodo._id } });
    });

    it('shows confirmation dialog before deleting', async () => {
      const wrapper = mount(TodoItem, {
        props: { todo: mockTodo },
      });

      await wrapper.find('button[aria-label="Delete Todo"]').trigger('click');
      expect(wrapper.find('.v-dialog').exists()).toBe(true);
      expect(wrapper.find('.v-card-text').text()).toContain(`Are you sure you want to delete "${mockTodo.title}"?`);
    });

    it('deletes todo on confirmation', async () => {
      const todoStore = useTodoStore();
      todoStore.deleteTodo = vi.fn().mockResolvedValue(true);

      const wrapper = mount(TodoItem, {
        props: { todo: mockTodo },
      });

      await wrapper.find('button[aria-label="Delete Todo"]').trigger('click');
      await wrapper.find('.v-dialog .v-btn--flat').trigger('click'); // Click delete button in dialog

      expect(todoStore.deleteTodo).toHaveBeenCalledWith(mockTodo._id);
      expect(wrapper.find('.v-dialog').exists()).toBe(false); // Dialog should close
    });
  });

  describe('TodoForm', () => {
    it('renders correctly for adding a new todo', () => {
      const wrapper = mount(TodoForm, {
        props: { isEdit: false },
      });
      expect(wrapper.find('.v-card-title').text()).toBe('Add New Todo');
      expect(wrapper.find('input[label="Title"]').exists()).toBe(true);
      expect(wrapper.find('textarea[label="Description (Optional)"]').exists()).toBe(true);
      expect(wrapper.find('input[label="Due Date (Optional)"]').exists()).toBe(true);
      expect(wrapper.find('label').text()).not.toContain('Completed'); // Checkbox not present for add
    });

    it('renders correctly for editing an existing todo', () => {
      const existingTodo = {
        _id: '123',
        title: 'Existing Todo',
        description: 'Existing description',
        completed: true,
        dueDate: new Date().toISOString(),
        userId: 'user1'
      };
      const wrapper = mount(TodoForm, {
        props: { todo: existingTodo, isEdit: true },
      });
      expect(wrapper.find('.v-card-title').text()).toBe('Edit Todo');
      expect(wrapper.find('input[label="Title"]').element.value).toBe('Existing Todo');
      expect(wrapper.find('textarea[label="Description (Optional)"]').element.value).toBe('Existing description');
      expect(wrapper.find('label').text()).toContain('Completed'); // Checkbox present for edit
    });

    it('emits submit event with new todo data', async () => {
      const wrapper = mount(TodoForm, {
        props: { isEdit: false },
      });

      const newTodoData = {
        title: 'New Task Title',
        description: 'New Task Description',
        dueDate: new Date('2024-12-31T00:00:00.000Z'),
        completed: false
      };

      await wrapper.find('input[label="Title"]').setValue(newTodoData.title);
      await wrapper.find('textarea[label="Description (Optional)"]').setValue(newTodoData.description);
      // For date picker, we'll directly set the model value as simulating UI interaction is complex
      wrapper.vm.localTodo.dueDate = newTodoData.dueDate;

      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.emitted().submit).toHaveLength(1);
      expect(wrapper.emitted().submit[0][0].title).toBe(newTodoData.title);
      expect(wrapper.emitted().submit[0][0].description).toBe(newTodoData.description);
      expect(wrapper.emitted().submit[0][0].dueDate).toEqual(newTodoData.dueDate);
    });

    it('emits submit event with updated todo data', async () => {
      const existingTodo = {
        _id: '123',
        title: 'Existing Todo',
        description: 'Existing description',
        completed: false,
        dueDate: null,
        userId: 'user1'
      };
      const wrapper = mount(TodoForm, {
        props: { todo: existingTodo, isEdit: true },
      });

      const updatedTitle = 'Updated Title';
      const updatedCompleted = true;

      await wrapper.find('input[label="Title"]').setValue(updatedTitle);
      await wrapper.find('input[type="checkbox"]').setChecked(updatedCompleted);

      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.emitted().submit).toHaveLength(1);
      expect(wrapper.emitted().submit[0][0].title).toBe(updatedTitle);
      expect(wrapper.emitted().submit[0][0].completed).toBe(updatedCompleted);
      expect(wrapper.emitted().submit[0][0]._id).toBe(existingTodo._id); // Ensure ID is preserved
    });

    it('displays error message from store', async () => {
      const todoStore = useTodoStore();
      todoStore.error = 'Failed to save todo.';

      const wrapper = mount(TodoForm, {
        props: { isEdit: false },
      });

      expect(wrapper.find('.v-alert').exists()).toBe(true);
      expect(wrapper.find('.v-alert').text()).toContain('Failed to save todo.');
    });

    it('navigates back on cancel button click in edit mode', async () => {
      const wrapper = mount(TodoForm, {
        props: { isEdit: true, todo: { _id: '1', title: 'a', description: '', completed: false, dueDate: null, userId: '1' } },
      });

      await wrapper.find('button.mt-3').trigger('click');
      expect(router.back).toHaveBeenCalled();
    });
  });
});