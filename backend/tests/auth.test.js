const request = require('supertest');
const app = require('../src/app');
const { User, sequelize } = require('../src/config/db'); // Import User and sequelize
const { generateToken } = require('../src/utils/jwt');

describe('Auth API', () => {
  const testUser = {
    username: 'testuser1',
    email: 'test1@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    // Clear and re-sync database for each test
    await sequelize.sync({ force: true });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toEqual(testUser.email);
    expect(res.body.user.username).toEqual(testUser.username);

    const userInDb = await User.findOne({ where: { email: testUser.email } });
    expect(userInDb).toBeDefined();
    expect(await userInDb.matchPassword(testUser.password)).toBe(true);
  });

  it('should not register a user with existing email', async () => {
    await User.create(testUser); // Create user first
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toContain('User with that email or username already exists.');
  });

  it('should login an existing user', async () => {
    await User.create(testUser); // Create user first
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toEqual(testUser.email);
  });

  it('should not login with incorrect password', async () => {
    await User.create(testUser);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid credentials');
  });

  it('should not login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid credentials');
  });

  it('should get authenticated user profile', async () => {
    const user = await User.create(testUser);
    const token = generateToken(user.id);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(user.email);
    expect(res.body.username).toEqual(user.username);
    expect(res.body).not.toHaveProperty('password');
  });

  it('should not get user profile without token', async () => {
    const res = await request(app)
      .get('/api/users/me');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Not authorized, no token');
  });

  it('should not get user profile with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Not authorized, token failed');
  });
});