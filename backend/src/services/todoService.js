const Todo = require('../models/Todo');

const createTodo = async (userId, todoData) => {
  const todo = new Todo({
    userId,
    title: todoData.title,
    description: todoData.description,
    dueDate: todoData.dueDate || null,
    completed: todoData.completed || false
  });
  return await todo.save();
};

const getTodosByUserId = async (userId) => {
  return await Todo.find({ userId }).sort({ createdAt: -1 });
};

const getTodoById = async (todoId, userId) => {
  return await Todo.findOne({ _id: todoId, userId });
};

const updateTodo = async (todoId, userId, updateData) => {
  const todo = await Todo.findOne({ _id: todoId, userId });

  if (!todo) {
    return null; // Not found or unauthorized
  }

  // Update fields if they exist in updateData
  if (updateData.title !== undefined) todo.title = updateData.title;
  if (updateData.description !== undefined) todo.description = updateData.description;
  if (updateData.completed !== undefined) todo.completed = updateData.completed;
  if (updateData.dueDate !== undefined) todo.dueDate = updateData.dueDate;

  todo.updatedAt = Date.now();
  return await todo.save();
};

const deleteTodo = async (todoId, userId) => {
  return await Todo.findOneAndDelete({ _id: todoId, userId });
};

module.exports = {
  createTodo,
  getTodosByUserId,
  getTodoById,
  updateTodo,
  deleteTodo
};