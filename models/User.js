const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country :{
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    smtpUser: {
        type: String,  // User's SMTP username for sending emails
        default: '',   // Empty by default
    },
    smtpPass: {
        type: String,  // User's SMTP password for sending emails
        default: '',   // Empty by default
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',  // Reference to Subscription model
        default: null,         // Null by default until subscribed to a package
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Pre-save middleware to hash password if it's new or being modified
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// // Pre-save middleware to hash smtpPass if it's being updated
// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('smtpPass') || this.smtpPass === '') {
//         next();
//     }

//     // Hash the SMTP password before saving
//     const salt = await bcrypt.genSalt(10);
//     this.smtpPass = await bcrypt.hash(this.smtpPass, salt);
//     next();
// });

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to compare entered SMTP password with hashed SMTP password
UserSchema.methods.matchSMTPPassword = async function (enteredSmtpPass) {
    return await bcrypt.compare(enteredSmtpPass, this.smtpPass);
};

module.exports = mongoose.model('User', UserSchema);
