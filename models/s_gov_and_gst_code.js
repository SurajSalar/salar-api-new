const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GovtGstCodeSchema = Schema({
    name: {
        type: String
    },
    gst: {
        type: Number
    },
    price_range: {
        type: String
    },
    govt_code: {
        type: String
    },
    status: {
        type: Number
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    sub_category: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    child_category: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
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

module.exports = { GovtGstCode: mongoose.model('GovtGstCode', GovtGstCodeSchema) };