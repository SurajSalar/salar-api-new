const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameSubCategorySchema = Schema({
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
        ref: 'GameCategory'
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

const GameSubCategory = module.exports = mongoose.model('GameSubCategory', GameSubCategorySchema);