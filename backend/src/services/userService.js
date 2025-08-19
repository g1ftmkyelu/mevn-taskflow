const User = require('../models/User');

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

module.exports = { getUserById };