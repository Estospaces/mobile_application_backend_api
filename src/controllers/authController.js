// controllers/authController.js
const authService = require("../services/authService");
const utils = require("../utils/commonUtils");
const userService = require("../services/userServices");
const sendEmail = require("../utils/sendEmail");

async function register(req, res) {
  try {
    const { email, password, full_name, phone_no, country, role } = req.body;

    // Check if email already exists
    const emailExists = await userService.checkUserByEmail(email);
    if (emailExists) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    // Check if phone number already exists
    const phoneExists = await userService.checkUserByPhone(phone_no);
    if (phoneExists) {
      return res.status(409).json({
        message: "Phone number is already registered",
      });
    }

    const hashedPassword = await utils.hashPassword(password);

    const userData = {
      email,
      password: hashedPassword,
      full_name,
      phone_no,
      country,
      role,
      active_user: 1,
      email_verified: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newUser = await userService.createUser(userData);
    // Send verification email (with link/button)
    await sendEmail.sendVerificationEmail(newUser);

    return res.status(201).json({
      message:
        "User registered successfully. Please verify your email to activate the account.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Missing verification token." });
    }
    const decoded = utils.verifyJWT(token);

    await userService.activateUserById(decoded.userId);

    return res.status(200).json({ message: "SUCCESS", token });
  } catch (error) {
    return res.status(400).json({
      message: "Verification failed or link expired.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userService.checkUserByEmail(
      email,
      "_id, email, password, email_verified"
    );
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const isPasswordValid = await utils.comparePasswords(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error:
          "Your email address has not been verified. Please check your inbox and verify your account to continue.",
      });
    }

    const token = utils.generateJWT({
      _id: user._id,
      email: user.email,
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await userService.checkUserByEmail(email, "_id, email");
    if (!user) throw new Error("Email not found.");

    const result = await authService.handleForgotPassword(email);
    // Send the OTP email and get the result
    const sendEmailResult = await sendEmail.sendOtpEmail(
      result.email,
      result.otp.code
    );

    // If email sent successfully and no error in sendEmailResult
    if (sendEmailResult.success) {
      return res.status(200).json({ message: sendEmailResult.message });
    }

    // If the email couldn't be sent
    throw new Error(sendEmailResult.message);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  try {
    const result = await authService.verifyOtp(email, otp);
    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function resetPassword(req, res) {
  const { email, password, confirmPassword } = req.body;
  try {
    const user = await userService.checkUserByEmail(email, "_id");
    if (!user) throw new Error("User not found.");

    const result = await authService.resetPassword(
      email,
      password,
      confirmPassword,
      user?._id
    );
    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
