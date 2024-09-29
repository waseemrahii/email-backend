

// const mongoose = require('mongoose');

// const EmailListSchema = new mongoose.Schema({
//     emails: [{ 
//         type: String, 
//         required: true, 
//         validate: {
//             validator: function(v) {
//                 return /.+@.+\..+/.test(v); // Simple regex to validate email
//             },
//             message: props => `${props.value} is not a valid email!`
//         }
//     }],
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('EmailList', EmailListSchema);


const mongoose = require('mongoose');

const EmailListSchema = new mongoose.Schema({
    emails: [{ 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /.+@.+\..+/.test(v); // Simple regex to validate email format
            },
            message: props => `${props.value} is not a valid email!`
        }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailList', EmailListSchema);
