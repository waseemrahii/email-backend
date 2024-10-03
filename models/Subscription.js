const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageType: {
        type: String,
        enum: ['free', 'enterprise', 'professional'],
        required: true
    },
  
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
