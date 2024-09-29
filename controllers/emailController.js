
const { validationResult } = require('express-validator');
const EmailList = require('../models/EmailList');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const emailService = require('../services/emailService');
const asyncHandler = require('express-async-handler');

exports.addEmailList = asyncHandler(async (req, res) => {
    const { emails, userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if an email list already exists for this user
        let emailList = await EmailList.findOne({ userId });

        if (emailList) {
            // If the email list exists, add new emails to it
            emailList.emails.push(...emails);
            await emailList.save(); // Save the updated email list
            res.status(200).json(emailList); // Return the updated email list
        } else {
            // If no email list exists, create a new one
            const newEmailList = new EmailList({ userId, emails });
            await newEmailList.save();
            res.status(201).json(newEmailList);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Send emails using a specific email list
exports.sendEmails = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { subject, body, emailListId, subscriptionId, userId } = req.body;

    try {
        const emailList = await EmailList.findById(emailListId);
        if (!emailList) {
            return res.status(404).json({ message: 'Email list not found' });
        }

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription || !subscription.isActive || subscription.packageExpiry < new Date()) {
            return res.status(403).json({ message: 'Invalid or expired subscription' });
        }

        const user = await User.findById(userId); // Fetch user to get SMTP credentials
        if (!user || !user.smtpUser || !user.smtpPass) {
            return res.status(403).json({ message: 'SMTP credentials are missing' });
        }

        if (subscription.emailsSentThisMonth + emailList.emails.length > subscription.emailsPerMonth) {
            return res.status(403).json({ message: 'Email quota exceeded for the month' });
        }

        await emailService.sendBulkEmails(emailList.emails, subject, body, user);
        
        subscription.emailsSentThisMonth += emailList.emails.length;
        await subscription.save();

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});



// Get a specific user's email and their email list
exports.getUserEmailById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId, 'email name');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const emailList = await EmailList.findOne({ userId }); // Fetch the email list for this user

        res.status(200).json({
            _id: emailList ? emailList._id : null, // Include EmailList _id if emailList exists
            user: {
                name: user.name,
                email: user.email // Include user's email in the response
            },
            emails: emailList ? emailList.emails : [] // Provide email list if it exists, otherwise an empty array
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

exports.getAllUserEmails = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}, 'email name'); // Fetch users' emails and names
        const emailLists = await EmailList.find({}); // Fetch all email lists

        // Create a structured response
        const response = users.map(user => {
            const userEmailList = emailLists.find(emailList => 
                emailList.userId && emailList.userId.toString() === user._id.toString() // Match the user ID
            );

            return {
                _id: userEmailList ? userEmailList._id : null, // Include emailList _id if exists
                user: {
                    _id: user._id, // Include the user's _id
                    name: user.name,
                    email: user.email
                },
                emails: userEmailList ? userEmailList.emails : [] // Include emails if emailList exists
            };
        });

        res.status(200).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});
