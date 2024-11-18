const Subscription = require('../models/Subscription');
const Package = require('../models/Package');
const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const User = require('../models/User');
const stripe = Stripe('sk_test_51Pwpi4023TaI0bKzl1dal6jK7njGYiTgT3Qr7Nt184Qr3wCyrr5pS5BP18NXj9GQAyeb9260jYQuCHN500GRv0kb00cRGQqW18'); // Replace with your Stripe secret key

// Subscribe to a package (with payment processing)
const subscribePackage = asyncHandler(async (req, res) => {
    const { userId, packageType, paymentMethodId, phoneCountry, zipCode } = req.body;

    // Find the package
    const package = await Package.findById(packageType);
    if (!package) {
        return res.status(400).json({ message: 'Invalid package type' });
    }

    if (package.price === 0) {
        // Free package: No payment required
        const subscription = await Subscription.create({
            userId,
            packageType: package._id,
            phoneCountry,
            zipCode,
            isActive: true
        });

        // Update user's subscription field
        await User.findByIdAndUpdate(userId, { subscription: subscription._id });

        return res.status(201).json({ subscription, message: 'Free package subscribed successfully' });
    }

    // Paid package: Process payment
    const amount = package.price * 100; // Convert price to cents
    const currency = 'usd'; // Set currency

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        const subscription = await Subscription.create({
            userId,
            packageType: package._id,
            phoneCountry,
            zipCode,
            isActive: true
        });

        // Update user's subscription field
        await User.findByIdAndUpdate(userId, { subscription: subscription._id });

        return res.status(201).json({ subscription });
    } catch (error) {
        console.error('Payment error:', error);
        return res.status(400).json({ message: 'Payment failed', error });
    }
});

// Get all subscriptions with populated user and packageType
const getSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find()
        .populate('userId', 'name email') // Populate user details
        .populate('packageType', 'type price maxEmailsPerMonth maxEmailsSentPerMonth'); // Populate packageType details

    return res.status(200).json(subscriptions);
});

// Get subscription by ID with populated user and packageType
const getSubscriptionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subscription = await Subscription.findById(id)
        .populate('userId', 'name email') // Populate user details
        .populate('packageType', 'type price maxEmailsPerMonth maxEmailsSentPerMonth'); // Populate packageType details

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
            emailsPerMonth: package.maxEmailsPerMonth,
            packageExpiry
        },
        { new: true }
    ).populate('packageType', 'type price maxEmailsPerMonth maxEmailsSentPerMonth'); // Populate updated packageType details

    if (!updatedSubscription) {
        return res.status(404).json({ message: 'Subscription not found' });
    }

    return res.status(200).json(updatedSubscription);
});



// const updateSubscription = async (req, res) => {
//     const { userId, subscriptionId } = req.body;

//     try {
//         const user = await User.findById(userId); // Find user using userId from req.body
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         user.subscription = subscriptionId; // Update subscription ID
//         await user.save();

//         res.status(200).json({ message: 'Subscription updated successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

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
