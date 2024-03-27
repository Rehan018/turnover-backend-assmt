const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../src/models/User');

describe('Auth Routes', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/e-commerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {

    await mongoose.connection.close();
  });

  afterEach(async () => {

    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toBeDefined();
    });


  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const existingUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      await existingUser.save();

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });


  });
});
