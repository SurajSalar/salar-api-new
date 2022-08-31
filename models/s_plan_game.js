const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlanSchema = Schema({
    name: {
        type: String
    },
    width: {
        type: Number
    },
    depth: {
        type: Number,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    stauts: {
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

const Plan = module.exports = { Plan: mongoose.model('Plan', PlanSchema) };