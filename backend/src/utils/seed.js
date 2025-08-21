require('dotenv').config();
const { sequelize, User, Todo, Category } = require('../src/config/db'); // Import sequelize and models

const seedData = async () => {
  try {
    console.log('Connecting to database and syncing models...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Use { force: true } to drop existing tables and recreate
    console.log('Database synced. Clearing existing data...');

    console.log('Creating default users...');
    const user1 = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123' // Password will be hashed by beforeCreate hook
    });
    console.log(`Default user created: ${user1.username} (${user1.email})`);

    const user2 = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123' // Password will be hashed by beforeCreate hook
    });
    console.log(`Second user created: ${user2.username} (${user2.email})`);

    console.log('Creating sample categories for users...');
    await Category.bulkCreate([
      { userId: user1.id, name: 'Work' },
      { userId: user1.id, name: 'Personal' },
      { userId: user1.id, name: 'Learning' },
      { userId: user1.id, name: 'Health' },
      { userId: user2.id, name: 'Shopping' },
      { userId: user2.id, name: 'Hobbies' }
    ]);
    console.log('Sample categories created.');

    console.log('Creating sample todos for users...');
    await Todo.bulkCreate([
      {
        userId: user1.id,
        title: 'Learn Vue.js Composition API',
        description: 'Deep dive into Vue 3 Composition API features and best practices.',
        completed: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        userId: user1.id,
        title: 'Build Express.js REST API',
        description: 'Implement all CRUD operations for the Todo resource with authentication.',
        completed: true,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: user1.id,
        title: 'Integrate SQLite with Sequelize',
        description: 'Set up database connection, define models, and perform queries.',
        completed: false,
        dueDate: null
      },
      {
        userId: user1.id,
        title: 'Configure Docker for MEVN Stack',
        description: 'Create Dockerfiles and docker-compose.yml for development and production.',
        completed: false,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      },
      {
        userId: user1.id,
        title: 'Plan Q3 Marketing Campaign',
        description: 'Outline strategies and allocate budget for the next quarter.',
        completed: false,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      },
      {
        userId: user1.id,
        title: 'Review Team Performance',
        description: 'Conduct one-on-one meetings and provide feedback.',
        completed: true,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        userId: user1.id,
        title: 'Prepare for Client Presentation',
        description: 'Finalize slides and rehearse key talking points.',
        completed: false,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        userId: user1.id,
        title: 'Research New Technologies',
        description: 'Explore AI/ML trends and their potential application.',
        completed: false,
        dueDate: null
      },
      // Todos for user2
      {
        userId: user2.id,
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, vegetables.',
        completed: false,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // Tomorrow
      },
      {
        userId: user2.id,
        title: 'Plan weekend trip',
        description: 'Research destinations and book accommodation.',
        completed: false,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
      },
      {
        userId: user2.id,
        title: 'Read "The Hitchhiker\'s Guide to the Galaxy"',
        description: 'Finish chapter 5.',
        completed: true,
        dueDate: null
      }
    ]);
    console.log('Sample todos created.');

    console.log('Seed data successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();