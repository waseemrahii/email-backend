const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const { body } = require('express-validator');

const router = express.Router();

router.post(
    '/subscribe',
    [
        body('userId').notEmpty().withMessage('User ID is required'),
        body('packageType').isIn(['basic', 'standard', 'premium']).withMessage('Invalid package type'),
    ],
    subscriptionController.subscribePackage
);

module.exports = router;
