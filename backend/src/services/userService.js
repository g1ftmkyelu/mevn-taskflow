const { User } = require('../config/db'); // Import User model from db config
const { Op } = require('sequelize');

const getUserById = async (id) => {
  return await User.findByPk(id, { attributes: { exclude: ['password'] } });
};

const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return null; // User not found
  }

  // Check for duplicate username/email if they are being updated
  if (updateData.username && updateData.username !== user.username) {
    const usernameExists = await User.findOne({ where: { username: updateData.username, id: { [Op.ne]: userId } } });
    if (usernameExists) {
      const error = new Error('Username already taken');
      error.statusCode = 409;
      throw error;
    }
    user.username = updateData.username;
  }

  if (updateData.email && updateData.email !== user.email) {
    const emailExists = await User.findOne({ where: { email: updateData.email, id: { [Op.ne]: userId } } });
    if (emailExists) {
      const error = new Error('Email already taken');
      error.statusCode = 409;
      throw error;
    }
    user.email = updateData.email;
  }

  await user.save();
  return user;
};

module.exports = { getUserById, updateUser };