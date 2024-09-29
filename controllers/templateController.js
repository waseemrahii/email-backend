
const EmailTemplate = require('../models/EmailTemplate');
const asyncHandler = require('express-async-handler');

exports.addTemplate = asyncHandler(async (req, res) => {
    const { name, subject, body } = req.body;
    
    const newTemplate = new EmailTemplate({ name, subject, body });
    await newTemplate.save();
    
    res.status(201).json(newTemplate);
});

exports.getTemplates = asyncHandler(async (req, res) => {
    const templates = await EmailTemplate.find();
    res.status(200).json(templates);
});
