const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BrandSchema = Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    topBrand: {
        type: Number,
    },
    status: {
        type: Number,
        default: 1
    },
    image: {
        type: String,
    },
    approval_letter: {
        type: String,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
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

const Brand = module.exports = mongoose.model('Brand', BrandSchema);