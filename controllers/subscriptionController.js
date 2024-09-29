// const Subscription = require('../models/Subscription');
// const asyncHandler = require('express-async-handler');

// const getPackageDetails = (packageType) => {
//     switch (packageType) {
//         case 'basic': return { emailsPerMonth: 10, packageDuration: 30 };
//         case 'standard': return { emailsPerMonth: 50, packageDuration: 30 };
//         case 'premium': return { emailsPerMonth: 100, packageDuration: 30 };
//         default: throw new Error('Invalid package type');
//     }
// };
 
// exports.subscribePackage = asyncHandler(async (req, res) => {
//     const { userId, packageType } = req.body;

//     const { emailsPerMonth, packageDuration } = getPackageDetails(packageType);
    
//     const packageExpiry = new Date();
//     packageExpiry.setDate(packageExpiry.getDate() + packageDuration);

//     const newSubscription = new Subscription({
//         userId,
//         packageType,
//         emailsPerMonth,
//         packageExpiry
//     });

//     await newSubscription.save();
//     res.status(201).json(newSubscription);
// });


const Subscription = require('../models/Subscription');
const Package = require('../models/Package');
const asyncHandler = require('express-async-handler');

const subscribePackage = asyncHandler(async (req, res) => {
    const { userId, packageType } = req.body;

    const package = await Package.findOne({ type: packageType });
    if (!package) {
        return res.status(400).json({ message: 'Invalid package type' });
    }

    const packageExpiry = new Date();
    packageExpiry.setDate(packageExpiry.getDate() + package.packageDuration); // Assuming packageDuration is in days

    const subscription = await Subscription.create({
        userId,
        packageType,
        emailsPerMonth: package.emailsPerMonth,
        packageExpiry
    });

    return res.status(201).json(subscription);
});

const getSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find().populate('userId', 'name email'); // Populate user details
    return res.status(200).json(subscriptions);
});

const getSubscriptionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subscription = await Subscription.findById(id).populate('userId', 'name email');

    if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
    }

    return res.status(200).json(subscription);
});

// Update a subscription
const updateSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { packageType } = req.body;

    // Get the package details
    const package = await Package.findOne({ type: packageType });
    if (!package) {
        return res.status(400).json({ message: 'Invalid package type' });
    }

    const packageExpiry = new Date();
    packageExpiry.setDate(packageExpiry.getDate() + package.packageDuration); // Assuming packageDuration is in days

    const updatedSubscription = await Subscription.findByIdAndUpdate(
        id,
        {
            packageType,
            emailsPerMonth: package.emailsPerMonth,
            packageExpiry
        },
        { new: true }
    );

    if (!updatedSubscription) {
        return res.status(404).json({ message: 'Subscription not found' });
    }

    return res.status(200).json(updatedSubscription);
});

// Delete a subscription
const deleteSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
        return res.status(404).json({ message: 'Subscription not found' });
    }

    return res.status(204).json({ message: 'Subscription deleted successfully' });
});

module.exports = { subscribePackage, getSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription };
