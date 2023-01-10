const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuthersSchema = Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
     gender: {
        type: String
    },
     qualification: {
        type: String
    },
     occupation: {
        type: String
    },
    organisation: {
        type: String
    },
    mobile: {
        type: String
    },
    email: {
        type: String
    },
    city: {
        type: String
    },
     state: {
        type: String
    },
    countryId: {
        type: Schema.Types.ObjectId,
        ref: 'Country'
    },
     isDeleted: { type: Boolean, default: false},
    status: { type: Boolean, default: true},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = { Authers: mongoose.model('Authers', AuthersSchema) };