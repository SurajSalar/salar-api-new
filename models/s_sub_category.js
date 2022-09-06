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
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
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

const SubCategory = module.exports = { SubCategory: mongoose.model('SubCategory', SubCategorySchema) };