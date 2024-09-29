const Package = require('../models/Package');
const asyncHandler = require('express-async-handler');

// Create a new package
const createPackage = asyncHandler(async (req, res) => {
    const { type, maxEmailsPerMonth, maxEmailsSentPerMonth, packageDuration, price } = req.body;

    // Check if package type already exists
    const existingPackage = await Package.findOne({ type });
    if (existingPackage) {
        return res.status(400).json({ message: 'Package type already exists' });
    }

    const newPackage = await Package.create({ 
        type, 
        maxEmailsPerMonth, 
        maxEmailsSentPerMonth, // Add this
        packageDuration, 
        price 
    });
    return res.status(201).json(newPackage);
});

// Get all packages
const getPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find();
    return res.status(200).json(packages);
});

// Get a single package by ID
const getPackageById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const package = await Package.findById(id);

    if (!package) {
        return res.status(404).json({ message: 'Package not found' });
    }

    return res.status(200).json(package);
});

// Update a package
const updatePackage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type, maxEmailsPerMonth, maxEmailsSentPerMonth, packageDuration, price } = req.body;

    const updatedPackage = await Package.findByIdAndUpdate(
        id,
        { 
            type, 
            maxEmailsPerMonth, 
            maxEmailsSentPerMonth, // Add this
            packageDuration, 
            price 
        },
        { new: true }
    );

    if (!updatedPackage) {
        return res.status(404).json({ message: 'Package not found' });
    }

    return res.status(200).json(updatedPackage);
});

// Delete a package
const deletePackage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
        return res.status(404).json({ message: 'Package not found' });
    }

    return res.status(204).json({ message: 'Package deleted successfully' });
});

module.exports = { createPackage, getPackages, getPackageById, updatePackage, deletePackage };
