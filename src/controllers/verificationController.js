const User = require("../models/User");

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });

    console.log('User:', user);
console.log('Verification Code (from request):', verificationCode);
console.log('Verification Code (from user object):', user.verificationCode);

    if (!user || user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }


    user.verified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
