import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';

// Configure VeeValidate to use English messages
configure({
  generateMessage: localize({ en }),
  validateOnBlur: true, // Validate on blur
  validateOnChange: true, // Validate on change
  validateOnInput: false, // Don't validate on every input keystroke
  validateOnModelUpdate: true, // Validate when v-model updates
});

export const required = value => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required';
  }
  return true;
};

export const email = value => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) {
    return 'Must be a valid email';
  }
  return true;
};

export const minLength = (value, length) => {
  if (value && value.length < length) {
    return `Must be at least ${length} characters`;
  }
  return true;
};

export const confirmed = (value, target) => {
  if (value !== target) {
    return 'Passwords do not match';
  }
  return true;
};