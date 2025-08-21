const Category = require('../models/Category');

const createCategory = async (userId, name) => {
  const categoryExists = await Category.findOne({ userId, name });
  if (categoryExists) {
    const error = new Error('Category with that name already exists for this user.');
    error.statusCode = 409;
    throw error;
  }
  const category = new Category({ userId, name });
  return await category.save();
};

const getCategoriesByUserId = async (userId) => {
  return await Category.find({ userId }).sort({ name: 1 });
};

const getCategoryById = async (categoryId, userId) => {
  return await Category.findOne({ _id: categoryId, userId });
};

const updateCategory = async (categoryId, userId, newName) => {
  const category = await Category.findOne({ _id: categoryId, userId });

  if (!category) {
    return null; // Not found or unauthorized
  }

  if (category.name !== newName) {
    // Check if new name already exists for this user
    const nameExists = await Category.findOne({ userId, name: newName, _id: { $ne: categoryId } });
    if (nameExists) {
      const error = new Error('Category with that name already exists for this user.');
      error.statusCode = 409;
      throw error;
    }
  }

  category.name = newName;
  category.updatedAt = Date.now();
  return await category.save();
};

const deleteCategory = async (categoryId, userId) => {
  return await Category.findOneAndDelete({ _id: categoryId, userId });
};

module.exports = {
  createCategory,
  getCategoriesByUserId,
  getCategoryById,
  updateCategory,
  deleteCategory
};