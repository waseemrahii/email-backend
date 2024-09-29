
// const EmailList = require('../models/EmailList');
// const emailService = require('../services/emailService');
// const { validationResult } = require('express-validator');

// // Controller for sending bulk emails
// exports.sendEmails = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { subject, body, emailListId } = req.body;

//     try {
//         // Find the email list by its ID
//         const emailList = await EmailList.findById(emailListId);
//         if (!emailList) {
//             return res.status(404).json({ message: 'Email list not found' });
//         }

//         // Send bulk emails using the service
//         await emailService.sendBulkEmails(emailList.emails, subject, body);
//         res.status(200).json({ message: 'Emails sent successfully' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Controller for adding a new email list
// exports.addEmailList = async (req, res) => {
//     const { name, emails } = req.body;
    
//     try {
//         // Create a new email list entry
//         const newEmailList = new EmailList({ emails });
//         await newEmailList.save();
//         res.status(201).json(newEmailList);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };



const EmailList = require('../models/EmailList');
const Subscription = require('../models/Subscription');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

exports.sendEmails = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { subject, body, emailListId, subscriptionId } = req.body;

    try {
        const emailList = await EmailList.findById(emailListId);
        if (!emailList) {
            return res.status(404).json({ message: 'Email list not found' });
        }

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription || !subscription.isActive || subscription.packageExpiry < new Date()) {
            return res.status(403).json({ message: 'Invalid or expired subscription' });
        }

        if (subscription.emailsSentThisMonth >= subscription.emailsPerMonth) {
            return res.status(403).json({ message: 'Email quota exceeded for the month' });
        }

        await emailService.sendBulkEmails(emailList.emails, subject, body);
        
        subscription.emailsSentThisMonth += emailList.emails.length;
        await subscription.save();

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addEmailList = async (req, res) => {
    const { emails } = req.body;
    
    try {
        const newEmailList = new EmailList({ emails });
        await newEmailList.save();
        res.status(201).json(newEmailList);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
