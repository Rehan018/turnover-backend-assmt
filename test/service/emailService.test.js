const nodemailer = require('nodemailer');
const { sendVerificationEmail } = require('../../src/services/emailService');


jest.mock('nodemailer');

describe('Email Service', () => {
  beforeEach(() => {

    nodemailer.createTransport.mockClear();
  });

  it('should send a verification email successfully', async () => {

    const mockTransporter = {
      sendMail: jest.fn().mockResolvedValueOnce('Email sent successfully'),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);


    const email = 'test@example.com';
    const verificationCode = '12345678';

    
    await sendVerificationEmail(email, verificationCode);


    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'cnsender2@gmail.com',
        pass: 'qrqulwdosrfoimld',
      },
    });


    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'cnsender2@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    });
  });


});
