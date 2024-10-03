const express = require('express');
const {
    signup,
    signin,
    updateSubscription,
    updateSMTP,
    forgotPassword,
    resetPassword,
    deleteUser,
    getAllUsers,
    getUserById
} = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Private Routes (Require Authentication)
router.put('/update-subscription',  updateSubscription);  // Update subscription ID
router.put('/update-smtp',  updateSMTP);                  // Update SMTP credentials
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteUser);        // Delete user
// router.get('/', isAuthenticated, isAdmin, getAllUsers);           // Get all users (admin only)
router.get('/',  getAllUsers);           // Get all users (admin only)
router.get('/:id', getUserById);  
module.exports = router;
