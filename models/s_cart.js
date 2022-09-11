const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CartSchema = Schema({
    ecomm_prod_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    game_prod_id: {
        type: Schema.Types.ObjectId,
        ref: 'GameProduct'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        default: 0
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

module.exports = { Cart: mongoose.model('Cart', CartSchema) };