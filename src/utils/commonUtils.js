const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  // 🔐 Generate 6-digit OTP
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // 🔒 Hash password
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  },

  // 🔍 Compare passwords
  async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Generate JWT Token
  async generateJWT(user) {
    const payload = {
      _id: user._id,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  },

  // Verify JWT Token
  async verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Synchronously resolve the token
      return decoded; // Return the decoded payload
    } catch (err) {
      throw new Error("Invalid or expired token.");
    }
  },
};
