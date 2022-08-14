const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EmailTemplateSchema = Schema({
    template_name: {
        type: String
    },
    template_code: {
        type: String
    },
    subject: {
        type: String
    },
    code_and_description: {
        type: String
    },
    content: {
        type: String
    },
    status: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const EmailTemplate = module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);