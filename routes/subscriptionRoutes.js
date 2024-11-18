
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

router.post('/', subscribePackage);


// Get all subscriptions
router.get('/', getSubscriptions);
router.get('/:id',  getSubscriptionById);
router.put( '/:id',  updateSubscription);

// Delete a subscription
router.delete('/:id', deleteSubscription);

module.exports = router;
