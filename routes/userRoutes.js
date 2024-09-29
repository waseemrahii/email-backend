const express = require('express');
const { signup, signin } = require('../controllers/userController');

const router = express.Router();

// POST /api/users/signup
router.post('/signup', signup);

// POST /api/users/signin
router.post('/signin', signin);

module.exports = router;
