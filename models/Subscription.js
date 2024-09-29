const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageType: {
        type: String,
        enum: ['basic', 'standard', 'premium'],
        required: true
    },
    emailsPerMonth: {
        type: Number,
        required: true
    },
    emailsSentThisMonth: {
        type: Number,
        default: 0
    },
    packageExpiry: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
