const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UnitSchema = Schema({
    name: {
        type: String
    },
    value: {
        type: String
    },
    status: {
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

module.exports = { Unit: mongoose.model('Unit', UnitSchema) };