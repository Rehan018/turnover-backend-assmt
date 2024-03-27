const jwt = require("jsonwebtoken");
const config = require("../../config");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("Token : - ",token)
    if (!token)
      return res.status(401).json({ error: "Authorization token missing" });

    const decoded = jwt.verify(token, config.jwtSecret);
    console.log("Decoded:", decoded);

    req.user ={_id:decoded.userId};
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
