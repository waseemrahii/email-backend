// controllers/templateController.js

const EmailTemplate = require('../models/EmailTemplate');
const asyncHandler = require('express-async-handler');

// Add a new email template
exports.addTemplate = asyncHandler(async (req, res) => {
  const { name, subject, body } = req.body;
  const newTemplate = new EmailTemplate({ name, subject, body });
  await newTemplate.save();
  res.status(201).json(newTemplate);
});

// Get all email templates
exports.getTemplates = asyncHandler(async (req, res) => {
  const templates = await EmailTemplate.find();
  res.status(200).json(templates);
});

// Get an email template by ID
exports.getTemplateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const template = await EmailTemplate.findById(id);
  
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  
  res.status(200).json(template);
});

// Update an email template by ID
exports.updateTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, subject, body } = req.body;

  const template = await EmailTemplate.findByIdAndUpdate(
    id,
    { name, subject, body },
    { new: true }
  );

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  res.status(200).json(template);
});

// Delete an email template by ID
exports.deleteTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const template = await EmailTemplate.findByIdAndDelete(id);

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  res.status(204).send(); // No content to return
});
