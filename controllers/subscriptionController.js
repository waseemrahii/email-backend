const Subscription = require('../models/Subscription');

exports.subscribePackage = async (req, res) => {
    const { userId, packageType } = req.body;

    let emailsPerMonth;
    let packageDuration; // in days

    switch(packageType) {
        case 'basic':
            emailsPerMonth = 10;
            packageDuration = 30;
            break;
        case 'standard':
            emailsPerMonth = 50;
            packageDuration = 30;
            break;
        case 'premium':
            emailsPerMonth = 100;
            packageDuration = 30;
            break;
        default:
            return res.status(400).json({ message: 'Invalid package type' });
    }

    const packageExpiry = new Date();
    packageExpiry.setDate(packageExpiry.getDate() + packageDuration);

    try {
        const newSubscription = new Subscription({
            userId,
            packageType,
            emailsPerMonth,
            packageExpiry
        });

        await newSubscription.save();
        res.status(201).json(newSubscription);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
