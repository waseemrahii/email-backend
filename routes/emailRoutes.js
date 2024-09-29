
const express = require('express');
const { body } = require('express-validator');
const emailController = require('../controllers/emailController');
const router = express.Router();

router.post(
    '/send',
    [
        body('subject').notEmpty().withMessage('Subject is required'),
        body('body').notEmpty().withMessage('Body is required'),
        body('emailListId').notEmpty().withMessage('Email List ID is required'),
        body('subscriptionId').notEmpty().withMessage('Subscription ID is required'),
    ],
    emailController.sendEmails
);

router.post(
    '/add',
    [
        body('emails').isArray().withMessage('Emails must be an array').notEmpty().withMessage('Emails are required')
    ],
    emailController.addEmailList
);

module.exports = router;
