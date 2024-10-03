// routes/templateRoutes.js

const express = require('express');
const templateController = require('../controllers/templateController');

const router = express.Router();

// Route for creating a new template
router.post('/', templateController.addTemplate);

// Route for getting all templates
router.get('/', templateController.getTemplates);

// Route for getting a template by ID
router.get('/:id', templateController.getTemplateById);

// Route for updating a template by ID
router.put('/:id', templateController.updateTemplate);

// Route for deleting a template by ID
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
