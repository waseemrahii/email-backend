// const Template = require('../models/EmailTemplate');

// // Add a new email template
// exports.addTemplate = async (req, res) => {
//     const { subject, body } = req.body;
//     try {
//         const newTemplate = new Template({ subject, body });
//         await newTemplate.save();
//         res.status(201).json({ message: 'Template added successfully', template: newTemplate });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Get all templates
// exports.getTemplates = async (req, res) => {
//     try {
//         const templates = await Template.find();
//         res.status(200).json(templates);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



const EmailTemplate = require('../models/EmailTemplate');

exports.addTemplate = async (req, res) => {
    const { name, subject, body } = req.body;
    try {
        const newTemplate = new EmailTemplate({ name, subject, body });
        await newTemplate.save();
        res.status(201).json(newTemplate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.find();
        res.status(200).json(templates);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
