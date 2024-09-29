// const express = require('express');
// const { body } = require('express-validator');
// const emailController = require('../controllers/emailController');

// const router = express.Router();

// router.post(
//     '/send',
//     [
//         body('subject').not().isEmpty(),
//         body('body').not().isEmpty(),
//         body('emailListId').not().isEmpty()
//     ],
//     emailController.sendEmails
// );

// router.post('/add', emailController.addEmailList);

// module.exports = router;



const express = require('express');
const { body } = require('express-validator');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.post(
    '/send',
    [
        body('subject').not().isEmpty(),
        body('body').not().isEmpty(),
        body('emailListId').not().isEmpty(),
        body('subscriptionId').not().isEmpty()
    ],
    emailController.sendEmails
);

router.post('/add', emailController.addEmailList);

module.exports = router;
