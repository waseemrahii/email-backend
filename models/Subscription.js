const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    phoneCountry: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
