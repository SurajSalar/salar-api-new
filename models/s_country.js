const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CountrySchema = Schema({
    name: {
        type: String
    },
    iso: {
        type: String
    },
    nickname: {
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

module.exports = { Country: mongoose.model('Country', CountrySchema) };