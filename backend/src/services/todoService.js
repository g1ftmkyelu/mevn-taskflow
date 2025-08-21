const { Todo } = require('../config/db'); // Import Todo model from db config

const createTodo = async (userId, todoData) => {
  const todo = await Todo.create({
    userId,
    title: todoData.title,
    description: todoData.description,
    dueDate: todoData.dueDate || null,
    completed: todoData.completed || false
  });
  return todo;
};

const getTodosByUserId = async (userId) => {
  return await Todo.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
};

const getTodoById = async (todoId, userId) => {
  return await Todo.findOne({ where: { id: todoId, userId } });
};

const updateTodo = async (todoId, userId, updateData) => {
  const todo = await Todo.findOne({ where: { id: todoId, userId } });

  if (!todo) {
    return null; // Not found or unauthorized
  }

  // Update fields if they exist in updateData
  if (updateData.title !== undefined) todo.title = updateData.title;
  if (updateData.description !== undefined) todo.description = updateData.description;
  if (updateData.completed !== undefined) todo.completed = updateData.completed;
  if (updateData.dueDate !== undefined) todo.dueDate = updateData.dueDate;

  await todo.save();
  return todo;
};

const deleteTodo = async (todoId, userId) => {
  const deletedRows = await Todo.destroy({ where: { id: todoId, userId } });
  return deletedRows > 0; // Returns true if a todo was deleted, false otherwise
};

module.exports = {
  createTodo,
  getTodosByUserId,
  getTodoById,
  updateTodo,
  deleteTodo
};