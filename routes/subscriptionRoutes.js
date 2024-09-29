
const express = require('express');
const {
    subscribePackage,
    getSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
} = require('../controllers/subscriptionController');
const { body, param } = require('express-validator');

const router = express.Router();

// Subscribe to a package
router.post(
    '/subscribe',
    [
        body('userId').notEmpty().withMessage('User ID is required'),
        body('packageType').isIn(['basic', 'standard', 'premium']).withMessage('Invalid package type'),
    ],
    subscribePackage
);

// Get all subscriptions
router.get('/', getSubscriptions);

// Get a single subscription by ID
router.get('/:id', param('id').isMongoId().withMessage('Invalid subscription ID'), getSubscriptionById);

// Update a subscription
router.put(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid subscription ID'),
        body('packageType').isIn(['basic', 'standard', 'premium']).withMessage('Invalid package type'),
    ],
    updateSubscription
);

// Delete a subscription
router.delete('/:id', param('id').isMongoId().withMessage('Invalid subscription ID'), deleteSubscription);

module.exports = router;
