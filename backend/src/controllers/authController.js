const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../utils/validation');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;
    const { user, token } = await authService.register(username, email, password);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    if (error.message.includes('duplicate key error')) {
      error.statusCode = 409; // Conflict
      error.message = 'User with that email or username already exists.';
    }
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    next(error);
  }
};