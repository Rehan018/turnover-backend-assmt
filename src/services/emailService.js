const nodemailer = require('nodemailer');
const config = require('../../config');

exports.sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
    service:'gmail',
      auth: {
        user: config.email.senderEmail,
        pass: config.email.senderPassword
      }
    });

    const mailOptions = {
      from: config.email.senderEmail,
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email} with code: ${verificationCode}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
};
