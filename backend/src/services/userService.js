const User = require('../models/User');

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    return null; // User not found
  }

  // Check for duplicate username/email if they are being updated
  if (updateData.username && updateData.username !== user.username) {
    const usernameExists = await User.findOne({ username: updateData.username, _id: { $ne: userId } });
    if (usernameExists) {
      const error = new Error('Username already taken');
      error.statusCode = 409;
      throw error;
    }
    user.username = updateData.username;
  }

  if (updateData.email && updateData.email !== user.email) {
    const emailExists = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
    if (emailExists) {
      const error = new Error('Email already taken');
      error.statusCode = 409;
      throw error;
    }
    user.email = updateData.email;
  }

  // Password update should be a separate, more secure process
  // For now, we only allow username and email updates
  user.updatedAt = Date.now();
  return await user.save();
};

module.exports = { getUserById, updateUser };