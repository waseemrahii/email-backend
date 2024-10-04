const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    maxEmailsPerMonth: {
        type: Number,
        required: true,
    },
    maxEmailsSentPerMonth: { // New field
        type: Number,
        required: true,
    },
    packageDuration: {
        type: Number,
        required: true, // Duration in days
    },
    price: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Package', PackageSchema);
