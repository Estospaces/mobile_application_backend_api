// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const propertiesController = require('../controllers/propertiesController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get("/verify-email", authController.verifyEmail);

router.post("/send-otp", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

// Route to create a property
router.post('/properties', propertiesController.createProperty);

// Route to get a property by ID
router.get('/properties/:id', propertiesController.getProperty);

// Route to update a property by ID (PATCH)
router.patch('/properties/:id', propertiesController.updateProperty);

// Route to soft delete (archive) a property by ID
router.delete('/properties/:id', propertiesController.deleteProperty);

// Route to publish a property
router.post('/properties/:id/publish', propertiesController.publishProperty);

// Route to unpublish a property
router.post('/properties/:id/unpublish', propertiesController.unpublishProperty);

// Route to change property status (e.g., sold, rented)
router.post('/properties/:id/status', propertiesController.updateStatus);

module.exports = router;
