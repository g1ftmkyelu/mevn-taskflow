const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const register = async (username, email, password) => {
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    const error = new Error('User with that email or username already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ username, email, password });

  if (user) {
    const token = generateToken(user._id);
    return { user, token };
  } else {
    const error = new Error('Invalid user data');
    error.statusCode = 400;
    throw error;
  }
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) { // Corrected: Use user.matchPassword
    const token = generateToken(user._id);
    return { user, token };
  } else {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
};

module.exports = { register, login };