const userService = require('../services/userService');
const { updateUserSchema } = require('../utils/validation');
const { UniqueConstraintError } = require('sequelize');

// @desc    Get current authenticated user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current authenticated user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res, next) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedUser = await userService.updateUser(req.user.id, req.body);
    if (!updatedUser) {
      const error = new Error('User not found or update failed');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      error.statusCode = 409; // Conflict
      error.message = 'Username or email already taken.';
    }
    next(error);
  }
};