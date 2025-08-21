require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/config/db'); // Destructure sequelize

const PORT = process.env.PORT || 4000;

// Connect to SQLite and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');
    // Sync all models
    await sequelize.sync({ alter: true }); // Use { alter: true } for development to update schema
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error(`Unable to connect to the database: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});