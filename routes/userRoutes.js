const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assume you have middleware for authentication



const PhoneVerificationController = require('../controllers/phoneVerificationController'); // Import the new controller



// Verify phone number route


// Route to send verification code to a phone number
router.post('/send-verification', PhoneVerificationController.sendVerificationCode);

// Route to verify the entered code
router.post('/verify-code', PhoneVerificationController.verifyCode);

module.exports = router;


// Create a new user
router.post('/add', UserController.createUser);

// Update user information
router.put('/:userId', UserController.updateUser);

// Delete user account
router.delete('/:userId', UserController.deleteUser);

// Retrieve all users
// Fetch all users (no token or ID check)
router.get('/all', UserController.getAllUsers);

// Fetch a specific user by ID
router.get('/:id', UserController.getUserById);

// User login
router.post('/login', UserController.loginUser);

// User logout
// Assuming you're using Express
router.post('/logout/:userId', UserController.logoutUser);


// Change user password
router.put('/:userId/password', UserController.changePassword);

module.exports = router;
