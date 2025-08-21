const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'test' ? ':memory:' : path.join(__dirname, '../../', process.env.SQLITE_DB_PATH || './data/taskflow.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

// Import models
const User = require('../models/User')(sequelize);
const Todo = require('../models/Todo')(sequelize);
const Category = require('../models/Category')(sequelize);

// Define associations
User.hasMany(Todo, { foreignKey: 'userId', onDelete: 'CASCADE' });
Todo.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Todo, Category };