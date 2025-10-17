// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get("/verify-email", authController.verifyEmail);

router.post("/send-otp", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
