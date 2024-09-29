const Subscription = require('../models/Subscription');
const asyncHandler = require('express-async-handler');

const getPackageDetails = (packageType) => {
    switch (packageType) {
        case 'basic': return { emailsPerMonth: 10, packageDuration: 30 };
        case 'standard': return { emailsPerMonth: 50, packageDuration: 30 };
        case 'premium': return { emailsPerMonth: 100, packageDuration: 30 };
        default: throw new Error('Invalid package type');
    }
};

exports.subscribePackage = asyncHandler(async (req, res) => {
    const { userId, packageType } = req.body;

    const { emailsPerMonth, packageDuration } = getPackageDetails(packageType);
    
    const packageExpiry = new Date();
    packageExpiry.setDate(packageExpiry.getDate() + packageDuration);

    const newSubscription = new Subscription({
        userId,
        packageType,
        emailsPerMonth,
        packageExpiry
    });

    await newSubscription.save();
    res.status(201).json(newSubscription);
});
