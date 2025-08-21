const express = require('express');
const { getMe, updateMe } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/me')
  .get(protect, getMe)
  .put(protect, updateMe); // New route for updating user profile

module.exports = router;