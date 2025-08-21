const jwt = require('jsonwebtoken');
const { User } = require('../config/db'); // Import User model from db config

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      if (!req.user) {
        const error = new Error('Not authorized, user not found');
        error.statusCode = 401;
        return next(error);
      }
      next();
    } catch (error) {
      console.error(error);
      const authError = new Error('Not authorized, token failed');
      authError.statusCode = 401;
      next(authError);
    }
  }

  if (!token) {
    const noTokenError = new Error('Not authorized, no token');
    noTokenError.statusCode = 401;
    next(noTokenError);
  }
};

module.exports = protect;