const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');




// Signup controller
exports.signup = async (req, res) => {
    const { username, email, password, phone, country, address } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            username,
            email,
            password,
            phone,
            country,
            address
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            token,
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email, 
                role: newUser.role,
                subscription: newUser.subscription  // Include subscription information
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Signin controller// Signin controller
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('subscription');  // Populate subscription field
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                address: user.address,
                phone: user.phone,
                country: user.country,
                role: user.role,
                subscription: user.subscription, // Include populated subscription data (which includes packageType)
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};




exports.updateSubscription = async (req, res) => {
    const { userId, subscriptionId } = req.body;

    try {
        const user = await User.findById(userId); // Find user using userId from req.body
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.subscription = subscriptionId; // Update subscription ID
        await user.save();

        res.status(200).json({ message: 'Subscription updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.updateSMTP = async (req, res) => {
    const { userId, smtpUser, smtpPass } = req.body;

    try {
        const user = await User.findById(userId); // Find user using userId from req.body
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.smtpUser = smtpUser;
        user.smtpPass = smtpPass; // Save new SMTP credentials
        await user.save();

        res.status(200).json({ message: 'SMTP credentials updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Forgot Password controller
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

        await user.save();

        // Send resetToken via email (SMTP not included in this example)
        res.status(200).json({ message: 'Password reset token sent', resetToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Reset Password controller
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete user controller (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all users controller (admin only)// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('subscription');  // Populate subscription field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Get all users controller (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('subscription');  // Populate subscription field for all users
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
