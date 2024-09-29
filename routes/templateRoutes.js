const express = require('express');
const templateController = require('../controllers/templateController');

const router = express.Router();

router.post('/', templateController.addTemplate);
router.get('/', templateController.getTemplates);

module.exports = router;
