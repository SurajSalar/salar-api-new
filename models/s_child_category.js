const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChildCategorySchema = Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Number
    },
    type: {
        type: Number,
    },
    seller: [{
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    }],
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    subcategory: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],
    image: {
        type: String,
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

const ChildCategory = module.exports = { ChildCategory: mongoose.model('ChildCategory', ChildCategorySchema) };