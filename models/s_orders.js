const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = Schema({
    payu_order_id: {
        type: String
    },
    logi_order_id: {
        type: String
    },
    ecomm_prod_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    game_prod_id: {
        type: Schema.Types.ObjectId,
        ref: 'GameProduct'
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        default: 0
    },
    unit_price: {
        type: Number,
        default: 0
    },
    final_price: {
        type: Number,
        default: 0
    },
    status: {
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

module.exports = { Order: mongoose.model('Order', OrderSchema) };