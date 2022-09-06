const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AttributeSchema = Schema({
    name: {
        type: String
    },
    value: {
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
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Unit'
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

module.exports = { Attribute: mongoose.model('Attribute', AttributeSchema) };