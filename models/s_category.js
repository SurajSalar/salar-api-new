const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = Schema({
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

const Category = module.exports = mongoose.model('Category', CategorySchema);