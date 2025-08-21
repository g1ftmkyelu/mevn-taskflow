const { Category } = require('../config/db'); // Import Category model from db config
const { Op } = require('sequelize');

const createCategory = async (userId, name) => {
  const categoryExists = await Category.findOne({ where: { userId, name } });
  if (categoryExists) {
    const error = new Error('Category with that name already exists for this user.');
    error.statusCode = 409;
    throw error;
  }
  const category = await Category.create({ userId, name });
  return category;
};

const getCategoriesByUserId = async (userId) => {
  return await Category.findAll({ where: { userId }, order: [['name', 'ASC']] });
};

const getCategoryById = async (categoryId, userId) => {
  return await Category.findOne({ where: { id: categoryId, userId } });
};

const updateCategory = async (categoryId, userId, newName) => {
  const category = await Category.findOne({ where: { id: categoryId, userId } });

  if (!category) {
    return null; // Not found or unauthorized
  }

  if (category.name !== newName) {
    // Check if new name already exists for this user, excluding the current category
    const nameExists = await Category.findOne({
      where: {
        userId,
        name: newName,
        id: { [Op.ne]: categoryId }
      }
    });
    if (nameExists) {
      const error = new Error('Category with that name already exists for this user.');
      error.statusCode = 409;
      throw error;
    }
  }

  category.name = newName;
  await category.save();
  return category;
};

const deleteCategory = async (categoryId, userId) => {
  const deletedRows = await Category.destroy({ where: { id: categoryId, userId } });
  return deletedRows > 0; // Returns true if a category was deleted, false otherwise
};

module.exports = {
  createCategory,
  getCategoriesByUserId,
  getCategoryById,
  updateCategory,
  deleteCategory
};