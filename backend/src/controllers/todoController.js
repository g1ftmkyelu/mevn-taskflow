const todoService = require('../services/todoService');
const { createTodoSchema, updateTodoSchema } = require('../utils/validation');

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
exports.createTodo = async (req, res, next) => {
  try {
    const { error } = createTodoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const todo = await todoService.createTodo(req.user.id, req.body);
    res.status(201).json({ message: 'Todo created successfully', todo });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all todos for authenticated user
// @route   GET /api/todos
// @access  Private
exports.getTodos = async (req, res, next) => {
  try {
    const todos = await todoService.getTodosByUserId(req.user.id);
    res.status(200).json({ todos });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Private
exports.getTodoById = async (req, res, next) => {
  try {
    const todo = await todoService.getTodoById(req.params.id, req.user.id);
    if (!todo) {
      const error = new Error('Todo not found or unauthorized');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ todo });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a todo by ID
// @route   PUT /api/todos/:id
// @access  Private
exports.updateTodo = async (req, res, next) => {
  try {
    const { error } = updateTodoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const todo = await todoService.updateTodo(req.params.id, req.user.id, req.body);
    if (!todo) {
      const error = new Error('Todo not found or unauthorized');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: 'Todo updated successfully', todo });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo by ID
// @route   DELETE /api/todos/:id
// @access  Private
exports.deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await todoService.deleteTodo(req.params.id, req.user.id);
    if (!deletedTodo) {
      const error = new Error('Todo not found or unauthorized');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};