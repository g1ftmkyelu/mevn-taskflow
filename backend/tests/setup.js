const { sequelize } = require('../src/config/db'); // Import sequelize instance

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_jwt_secret_for_testing_only';
  process.env.NODE_ENV = 'test';
  process.env.SQLITE_DB_PATH = ':memory:'; // Use in-memory SQLite for tests

  // Connect to the database and sync models
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // This will drop tables and recreate them
    console.log('Test database connected and synced.');
  } catch (error) {
    console.error('Unable to connect to the test database:', error);
    process.exit(1);
  }
});

beforeEach(async () => {
  // Clear all data before each test by re-syncing with force: true
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close the database connection after all tests are done
  await sequelize.close();
  console.log('Test database connection closed.');
});