const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');
const { generateVerificationCode } = require('../utils/verificationCodeGenerator');


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode=generateVerificationCode();
    const user = new User({ username, email, password: hashedPassword,verificationCode });
    await user.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      if (!user.verified) {
        return res.status(401).json({ error: 'Email not verified' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = { register, login };
