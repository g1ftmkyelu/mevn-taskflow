const categoryService = require('../services/categoryService');
const { createCategorySchema, updateCategorySchema } = require('../utils/validation');
const { UniqueConstraintError } = require('sequelize');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name } = req.body;
    const category = await categoryService.createCategory(req.user.id, name);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      error.statusCode = 409; // Conflict
      error.message = 'Category with that name already exists for this user.';
    }
    next(error);
  }
};

// @desc    Get all categories for authenticated user
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategoriesByUserId(req.user.id);
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id, req.user.id);
    if (!category) {
      const error = new Error('Category not found or unauthorized');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category by ID
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    const { error } = updateCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name } = req.body;
    const category = await categoryService.updateCategory(req.params.id, req.user.id, name);
    if (!category) {
      const error = new Error('Category not found or unauthorized');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      error.statusCode = 409; // Conflict
      error.message = 'Category with that name already exists for this user.';
    }
    next(error);
  }
};

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await categoryService.deleteCategory(req.params.id, req.user.id);
    if (!deletedCategory) {
      const error = new Error('Category not found or unauthorized');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};