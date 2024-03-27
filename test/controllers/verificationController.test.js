const request = require('supertest');
const app = require('../../app');
const User = require('../../src/models/User');

describe('Verification Controller', () => {
  describe('POST /api/verification/verify-email', () => {
    it('should verify user email with valid verification code', async () => {

      const verificationCode = '12345678';
      const user = new User({ email: 'test@example.com', verificationCode });
      await user.save();


      const res = await request(app)
        .post('/api/verification/verify-email')
        .send({ email: 'test@example.com', verificationCode })
        .expect(200);


      expect(res.body.message).toBe('Email verified successfully');


      const verifiedUser = await User.findOne({ email: 'test@example.com' });
      expect(verifiedUser.verified).toBe(true);
    });

    it('should return 400 with invalid verification code', async () => {

      const user = new User({ email: 'test@example.com', verificationCode: '12345678' });
      await user.save();


      const res = await request(app)
        .post('/api/verification/verify-email')
        .send({ email: 'test@example.com', verificationCode: '87654321' })
        .expect(400);


      expect(res.body.error).toBe('Invalid verification code');


      const unverifiedUser = await User.findOne({ email: 'test@example.com' });
      expect(unverifiedUser.verified).toBe(false);
    });

    it('should return 400 with non-existing email', async () => {

      const res = await request(app)
        .post('/api/verification/verify-email')
        .send({ email: 'nonexisting@example.com', verificationCode: '12345678' })
        .expect(400);
        
      expect(res.body.error).toBe('Invalid verification code');
    });

  });
});
