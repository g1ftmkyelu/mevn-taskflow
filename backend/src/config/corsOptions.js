const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;