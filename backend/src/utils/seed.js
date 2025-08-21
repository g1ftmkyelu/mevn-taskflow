require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');
const Category = require('../models/Category'); // New
const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();

  try {
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Todo.deleteMany({});
    await Category.deleteMany({}); // New
    console.log('Existing data cleared.');

    console.log('Creating default user...');
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123' // Password will be hashed by pre-save hook
    });
    console.log(`Default user created: ${user.username} (${user.email})`);

    console.log('Creating sample todos for the user...');
    await Todo.insertMany([
      {
        userId: user._id,
        title: 'Learn Vue.js Composition API',
        description: 'Deep dive into Vue 3 Composition API features and best practices.',
        completed: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        userId: user._id,
        title: 'Build Express.js REST API',
        description: 'Implement all CRUD operations for the Todo resource with authentication.',
        completed: true,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: user._id,
        title: 'Integrate MongoDB with Mongoose',
        description: 'Set up database connection, define schemas, and perform queries.',
        completed: false,
        dueDate: null
      },
      {
        userId: user._id,
        title: 'Configure Docker for MEVN Stack',
        description: 'Create Dockerfiles and docker-compose.yml for development and production.',
        completed: false,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      },
      {
        userId: user._id,
        title: 'Plan Q3 Marketing Campaign',
        description: 'Outline strategies and allocate budget for the next quarter.',
        completed: false,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      },
      {
        userId: user._id,
        title: 'Review Team Performance',
        description: 'Conduct one-on-one meetings and provide feedback.',
        completed: true,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        userId: user._id,
        title: 'Prepare for Client Presentation',
        description: 'Finalize slides and rehearse key talking points.',
        completed: false,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        userId: user._id,
        title: 'Research New Technologies',
        description: 'Explore AI/ML trends and their potential application.',
        completed: false,
        dueDate: null
      }
    ]);
    console.log('Sample todos created.');

    console.log('Creating sample categories for the user...');
    await Category.insertMany([
      { userId: user._id, name: 'Work' },
      { userId: user._id, name: 'Personal' },
      { userId: user._id, name: 'Learning' },
      { userId: user._id, name: 'Health' }
    ]);
    console.log('Sample categories created.');

    console.log('Seed data successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();