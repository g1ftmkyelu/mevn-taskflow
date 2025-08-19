const express = require('express');
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createTodo)
  .get(protect, getTodos);

router.route('/:id')
  .get(protect, getTodoById)
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

module.exports = router;