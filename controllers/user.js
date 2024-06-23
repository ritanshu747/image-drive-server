const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { firstname, lastName, email, password } = req.body;

        // Validation
        if (!firstname || !lastName || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "Please fill all required fields!"
            });
        }

        // Check if user already exists
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(403).json({
                success: false,
                message: "User already exists. Try logging in."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            email,
            firstName: firstname,
            lastName,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            user: newUser,
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('Error in signup:', error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again.'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "Please fill all details",
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found. Please register before login.",
            });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect.",
            });
        }

        // Generate JWT token
        const payload = {
            email: user.email,
            id: user._id,
            // You can add additional user fields here if needed
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token as cookie or return it in response body
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
        };
        res.cookie('token', token, options);

        // Return success response with token and user details
        return res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                // Add other user fields here if needed
            },
            message: 'User login successful',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Login failed, please try again.',
        });
    }
};