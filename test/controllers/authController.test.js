const request = require('supertest');
const app = require('../../app');
const User = require('../../src/models/User');
const bcrypt = require('bcrypt');

describe('Auth Controller Tests', () => {
  let user;

  beforeAll(async () => {

    const hashedPassword = await bcrypt.hash('testpassword', 10);
    user = await User.create({ username: 'testuser', email: 'test@example.com', password: hashedPassword });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'newuser', email: 'newuser@example.com', password: 'password123' });
      
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'testpassword' });
      
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.token).toBeDefined();
  });

  it('should return error for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'invalidpassword' });
      
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});
