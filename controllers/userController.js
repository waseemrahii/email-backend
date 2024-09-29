const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// User Signup
const signup = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        role
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: { id: user._id, username, email, role }, token });
});

// User Signin
const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ user: { id: user._id, username: user.username, email, role: user.role }, token });
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// Update User Role
const updateUserRole = asyncHandler(async (req, res) => {
    const { userId, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully.', user });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'No user with that email address.' });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

    // const transporter = nodemailer.createTransport({
    //     service: 'Gmail', // Example using Gmail
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD,
    //     },
    // });
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        debug: true,  // Add this to get more detailed output
    });
    
    const message = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset.</p>
               <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`
    };

    await transporter.sendMail(message);

    res.status(200).json({ message: 'Password reset email sent.' });
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
});


const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params; 

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    await User.findByIdAndDelete(id); 
    res.status(200).json({ message: 'User deleted successfully.' });
});
module.exports = { signup, signin, getAllUsers, updateUserRole,deleteUser, forgotPassword, resetPassword };
