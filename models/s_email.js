const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EmailSchema = Schema({
    sender_name: {
        type: String
    },
    email_driver: {
        type: String
    },
    email_address: {
        type: String
    },
    email_host: {
        type: String
    },
    email_username: {
        type: String
    },
    email_port: {
        type: String
    },
    email_password: {
        type: String
    },
    email_encryption: {
        type: Number
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

const Email = module.exports = mongoose.model('Email', EmailSchema);