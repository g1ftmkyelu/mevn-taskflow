const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/register', rateLimitMiddleware, registerUser);
router.post('/login', rateLimitMiddleware, loginUser);

module.exports = router;