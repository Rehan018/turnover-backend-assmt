const mongoose = require('mongoose');
const User = require('../../src/models/User');

describe('User Model', () => {
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

  it('should create and save a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      verified: false,
      verificationCode: '12345678',
    };
    const user = new User(userData);
    const savedUser = await user.save();

    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.verified).toBe(userData.verified);
    expect(savedUser.verificationCode).toBe(userData.verificationCode);
  });


});
