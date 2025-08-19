import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import LoginForm from '@/components/Auth/LoginForm.vue';
import RegisterForm from '@/components/Auth/RegisterForm.vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router'; // Import the actual router

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock router push
vi.mock('@/router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    push: vi.fn(),
  };
});

describe('Auth Components', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear(); // Clear localStorage before each test
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe('LoginForm', () => {
    it('renders correctly and handles input', async () => {
      const wrapper = mount(LoginForm);
      expect(wrapper.find('h5').text()).toBe('Login to TaskFlow');

      const emailInput = wrapper.find('input[type="email"]');
      await emailInput.setValue('test@example.com');
      expect(emailInput.element.value).toBe('test@example.com');

      const passwordInput = wrapper.find('input[type="password"]');
      await passwordInput.setValue('password123');
      expect(passwordInput.element.value).toBe('password123');
    });

    it('calls login action on submit with valid data', async () => {
      const authStore = useAuthStore();
      authStore.login = vi.fn().mockResolvedValue(true); // Mock successful login

      const wrapper = mount(LoginForm);
      await wrapper.find('input[type="email"]').setValue('test@example.com');
      await wrapper.find('input[type="password"]').setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      expect(authStore.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(router.push).toHaveBeenCalledWith({ name: 'todos' });
    });

    it('displays error message on failed login', async () => {
      const authStore = useAuthStore();
      authStore.login = vi.fn().mockResolvedValue(false);
      authStore.error = 'Invalid credentials';

      const wrapper = mount(LoginForm);
      await wrapper.find('input[type="email"]').setValue('wrong@example.com');
      await wrapper.find('input[type="password"]').setValue('wrongpass');
      await wrapper.find('form').trigger('submit.prevent');

      expect(authStore.login).toHaveBeenCalled();
      expect(wrapper.find('.v-alert').exists()).toBe(true);
      expect(wrapper.find('.v-alert').text()).toContain('Invalid credentials');
    });

    it('navigates to register page', async () => {
      const wrapper = mount(LoginForm);
      await wrapper.find('button.v-btn--text').trigger('click');
      expect(router.push).toHaveBeenCalledWith('/register');
    });
  });

  describe('RegisterForm', () => {
    it('renders correctly and handles input', async () => {
      const wrapper = mount(RegisterForm);
      expect(wrapper.find('h5').text()).toBe('Register for TaskFlow');

      const usernameInput = wrapper.find('input[label="Username"]');
      await usernameInput.setValue('newuser');
      expect(usernameInput.element.value).toBe('newuser');

      const emailInput = wrapper.find('input[type="email"]');
      await emailInput.setValue('new@example.com');
      expect(emailInput.element.value).toBe('new@example.com');

      const passwordInput = wrapper.find('input[label="Password"]');
      await passwordInput.setValue('newpassword');
      expect(passwordInput.element.value).toBe('newpassword');

      const confirmPasswordInput = wrapper.find('input[label="Confirm Password"]');
      await confirmPasswordInput.setValue('newpassword');
      expect(confirmPasswordInput.element.value).toBe('newpassword');
    });

    it('calls register action on submit with valid data', async () => {
      const authStore = useAuthStore();
      authStore.register = vi.fn().mockResolvedValue(true);

      const wrapper = mount(RegisterForm);
      await wrapper.find('input[label="Username"]').setValue('newuser');
      await wrapper.find('input[type="email"]').setValue('new@example.com');
      await wrapper.find('input[label="Password"]').setValue('newpassword');
      await wrapper.find('input[label="Confirm Password"]').setValue('newpassword');
      await wrapper.find('form').trigger('submit.prevent');

      expect(authStore.register).toHaveBeenCalledWith('newuser', 'new@example.com', 'newpassword');
      expect(router.push).toHaveBeenCalledWith({ name: 'todos' });
    });

    it('displays error message on failed registration', async () => {
      const authStore = useAuthStore();
      authStore.register = vi.fn().mockResolvedValue(false);
      authStore.error = 'User already exists';

      const wrapper = mount(RegisterForm);
      await wrapper.find('input[label="Username"]').setValue('existinguser');
      await wrapper.find('input[type="email"]').setValue('existing@example.com');
      await wrapper.find('input[label="Password"]').setValue('password123');
      await wrapper.find('input[label="Confirm Password"]').setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      expect(authStore.register).toHaveBeenCalled();
      expect(wrapper.find('.v-alert').exists()).toBe(true);
      expect(wrapper.find('.v-alert').text()).toContain('User already exists');
    });

    it('navigates to login page', async () => {
      const wrapper = mount(RegisterForm);
      await wrapper.find('button.v-btn--text').trigger('click');
      expect(router.push).toHaveBeenCalledWith('/login');
    });
  });
});