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
        type: Number
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

const Country = module.exports = mongoose.model('Country', CountrySchema);