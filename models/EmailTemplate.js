// // const mongoose = require('mongoose');

// // const EmailTemplateSchema = new mongoose.Schema({
// //     name: { type: String, required: true },
// //     subject: { type: String, required: true },
// //     body: { type: String, required: true },
// //     createdAt: { type: Date, default: Date.now }
// // });

// // module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);



// const mongoose = require('mongoose');

// const templateSchema = new mongoose.Schema({
//     subject: {
//         type: String,
//         required: true
//     },
//     body: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Template', templateSchema);



const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
