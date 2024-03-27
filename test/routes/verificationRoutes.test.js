const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../src/models/User');

describe('Verification Routes', () => {
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

  describe('POST /api/verification/verify-email', () => {
    it('should verify email successfully', async () => {
      
      const user = new User({
        username: 'TestUser',
        email: 'test@example.com',
        password: 'testpassword',
        verificationCode: '12345678', 
      });
      await user.save();


      const verificationData = {
        email: 'test@example.com',
        verificationCode: '12345678',
      };
      const response = await request(app)
        .post('/api/verification/verify-email')
        .send(verificationData)
        .expect(200);

      expect(response.body.message).toBe('Email verified successfully');
    });


  });
});
