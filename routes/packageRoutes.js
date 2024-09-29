const express = require('express');
const { 
    createPackage, 
    getPackages, 
    getPackageById, 
    updatePackage, 
    deletePackage 
} = require('../controllers/packageController');
const { body, param } = require('express-validator');

const router = express.Router();

// Create a new package
router.post(
    '/',
    [
        body('type').isIn(['basic', 'standard', 'premium']).withMessage('Invalid package type'),
        body('maxEmailsPerMonth').isInt().withMessage('Max emails per month must be an integer'),
        body('maxEmailsSentPerMonth').isInt().withMessage('Max emails sent per month must be an integer'), // Add validation
        body('packageDuration').isInt().withMessage('Package duration must be an integer'),
        body('price').isFloat().withMessage('Price must be a number'),
    ],
    createPackage
);

// Get all packages
router.get('/', getPackages);

// Get a single package by ID
router.get('/:id', param('id').isMongoId().withMessage('Invalid package ID'), getPackageById);

// Update a package
router.put(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid package ID'),
        body('type').optional().isIn(['basic', 'standard', 'premium']).withMessage('Invalid package type'),
        body('maxEmailsPerMonth').optional().isInt().withMessage('Max emails per month must be an integer'),
        body('maxEmailsSentPerMonth').optional().isInt().withMessage('Max emails sent per month must be an integer'), // Add validation
        body('packageDuration').optional().isInt().withMessage('Package duration must be an integer'),
        body('price').optional().isFloat().withMessage('Price must be a number'),
    ],
    updatePackage
);

// Delete a package
router.delete('/:id', param('id').isMongoId().withMessage('Invalid package ID'), deletePackage);

module.exports = router;
