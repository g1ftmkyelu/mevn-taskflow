const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Todo = require('../src/models/Todo');
const { generateToken } = require('../src/utils/jwt');

describe('Todo API', () => {
  let user;
  let token;
  let todoId;

  beforeEach(async () => {
    // Create a user and get a token for authenticated requests
    user = await User.create({
      username: 'todouser',
      email: 'todo@example.com',
      password: 'password123'
    });
    token = generateToken(user._id);

    // Create a sample todo for the user
    const todo = await Todo.create({
      userId: user._id,
      title: 'Initial Todo',
      description: 'This is a test todo.',
      completed: false
    });
    todoId = todo._id;
  });

  it('should create a new todo', async () => {
    const newTodo = {
      title: 'New Task',
      description: 'Description for new task',
      dueDate: new Date().toISOString()
    };
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Todo created successfully');
    expect(res.body.todo.title).toEqual(newTodo.title);
    expect(res.body.todo.userId.toString()).toEqual(user._id.toString());
  });

  it('should get all todos for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.todos).toBeInstanceOf(Array);
    expect(res.body.todos.length).toBeGreaterThan(0);
    expect(res.body.todos[0].title).toEqual('Initial Todo');
  });

  it('should get a specific todo by ID', async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.todo.title).toEqual('Initial Todo');
    expect(res.body.todo._id.toString()).toEqual(todoId.toString());
  });

  it('should return 404 if todo not found or unauthorized', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/todos/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Todo not found or unauthorized');
  });

  it('should update an existing todo', async () => {
    const updatedData = {
      title: 'Updated Todo Title',
      completed: true
    };
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Todo updated successfully');
    expect(res.body.todo.title).toEqual(updatedData.title);
    expect(res.body.todo.completed).toEqual(updatedData.completed);
  });

  it('should not update a todo if unauthorized', async () => {
    const anotherUser = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123'
    });
    const anotherToken = generateToken(anotherUser._id);

    const updatedData = { title: 'Attempted Update' };
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Todo not found or unauthorized');
  });

  it('should delete a todo', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Todo deleted successfully');

    const deletedTodo = await Todo.findById(todoId);
    expect(deletedTodo).toBeNull();
  });

  it('should not delete a todo if unauthorized', async () => {
    const anotherUser = await User.create({
      username: 'thirduser',
      email: 'third@example.com',
      password: 'password123'
    });
    const anotherToken = generateToken(anotherUser._id);

    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${anotherToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Todo not found or unauthorized');
  });
});