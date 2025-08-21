const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'string.empty': 'Username is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required'
  })
});

const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 255 characters',
    'string.empty': 'Title is required'
  }),
  description: Joi.string().max(1000).allow('').optional().messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  completed: Joi.boolean().optional(), // Added 'completed' field as optional
  dueDate: Joi.date().allow(null).optional().messages({
    'date.base': 'Due date must be a valid date'
  })
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().messages({
    'string.min': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 255 characters'
  }),
  description: Joi.string().max(1000).allow('').optional().messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  completed: Joi.boolean().optional(),
  dueDate: Joi.date().allow(null).optional().messages({
    'date.base': 'Due date must be a valid date'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Category name cannot be empty',
    'string.max': 'Category name cannot exceed 50 characters',
    'string.empty': 'Category name is required'
  })
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Category name cannot be empty',
    'string.max': 'Category name cannot exceed 50 characters',
    'string.empty': 'Category name is required'
  })
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please enter a valid email address'
  })
}).min(1).messages({
  'object.min': 'At least one field (username or email) must be provided for update'
});

module.exports = {
  registerSchema,
  loginSchema,
  createTodoSchema,
  updateTodoSchema,
  createCategorySchema,
  updateCategorySchema,
  updateUserSchema
};