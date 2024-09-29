

const express = require('express');
const { body } = require('express-validator');
const { sendEmails, addEmailList, getAllUserEmails, getUserEmailById } = require('../controllers/emailController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
    '/send',
    // isAuthenticated,
    [
        body('subject').notEmpty().withMessage('Subject is required'),
        body('body').notEmpty().withMessage('Body is required'),
        body('emailListId').notEmpty().withMessage('Email List ID is required'),
        body('subscriptionId').notEmpty().withMessage('Subscription ID is required'),
        body('userId').notEmpty().withMessage('User ID is required'),
    ],
    sendEmails
);

router.post(
    '/add',
    // isAuthenticated,
    [
        body('emails').isArray().withMessage('Emails must be an array').notEmpty().withMessage('Emails are required'),
        body('userId').notEmpty().withMessage('User ID is required'),
    ],
    addEmailList
);

// Get all email lists for a specific user
router.get('/user/:userId/emails', getUserEmailById); // Change from getUserEmails to getUserEmailById

// Get all users' emails (optional)
router.get('/users/emails', getAllUserEmails);

// Get a specific user's email by their ID
router.get('/user/:userId', getUserEmailById);

module.exports = router;
