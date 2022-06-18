const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubCategorySchema = Schema({
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
    seller_id:  [{
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    }],
    category_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    subcategory_id: [{
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

const SubCategory = module.exports = mongoose.model('Category', SubCategorySchema);