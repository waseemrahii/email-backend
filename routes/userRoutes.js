const express = require('express');
const { signup, signin, getAllUsers, updateUserRole, deleteUser, forgotPassword, resetPassword } = require('../controllers/userController');
const { isAdmin, isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.put('/update-role', isAuthenticated, isAdmin, updateUserRole);
// router.delete('/:userId', isAuthenticated, isAdmin, deleteUser); 
router.delete('/:id',  deleteUser); 
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;