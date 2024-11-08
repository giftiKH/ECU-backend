const User = require('../models/User'); // Import User model
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWTs
const mongoose = require('mongoose'); // For ObjectId handling  


const sendEmail = require('../utils/emailService'); // Adjust the path based on your folder structure
const crypto = require('crypto'); // Import crypto for generating random passwords


exports.createUser = async (req, res) => {
    try {
        const { name, email, role, organization } = req.body;

        // Validate input data
        if (!name || !email || !role || !organization) {
            return res.status(400).json({ message: 'All fields except phone number are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Generate a random password
        const generatedPassword = generateRandomPassword();

        // Hash the password
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber: '', // Keep phone number empty initially
            role,
            organization,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSeen: new Date(),
            profilePicture: 'uploads/profile/AWCA-logo.png' // Default placeholder image
        });

        // Save the user to the database
        await newUser.save();

        // Call the chat middleware to create chat groups


        // Send email with credentials
        await sendEmail(email, 'Your Account Credentials', `Your password is: ${generatedPassword}`);

        return res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Function to generate a random password
const generateRandomPassword = () => {
    const length = 10; // Set the desired length of the password
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};


// Retrieve user information by ID or email
// Fetch a specific user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;  // Get ID from route parameters

        // Fetch the user with the given ID, exclude password field
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};



// Update user information
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, phoneNumber, role, profilePicture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, {
            name,
            phoneNumber,
            role,
            profilePicture,
            updatedAt: new Date(),
            name,
            email,
            organization,
            profilePicture
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Delete user account (soft delete)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find and delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};


// Retrieve all users

// Controller to fetch all users

// Controller to fetch all users

// Controller to fetch all users from the database
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding the password field
        const users = await User.find().select('-password');

        // Return the users data
        return res.status(200).json(users);
    } catch (error) {
        // Log the error and return a 500 status with an error message
        console.error('Error fetching users:', error.message);
        console.error(error.stack);

        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};


// User login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login successful.',
            token,
            userId: user._id,
            role: user.role,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// User logout
exports.logoutUser = async (req, res) => {
    try {
        const { userId } = req.params;  // Assuming userId is passed as a route parameter

        // Update the user's lastSeen field when they log out
        const updatedUser = await User.findByIdAndUpdate(userId, { lastSeen: new Date() }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Implement any other logout logic here (like token invalidation if you're using JWT)

        return res.status(200).json({ message: 'Logout successful.', user: updatedUser });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Server error during logout.' });
    }
}; 


// Change user password
exports.changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
