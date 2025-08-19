const userService = require('../services/userService');

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
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
};