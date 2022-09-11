const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSummarySchema = Schema({
    order_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    refferal_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    total_price: {
        type: Number,
        default: 0
    },
    tranx_fees: {
        type: Number,
        default: 0
    },
    txnid: {
        type: String,
        default: 0
    },
    trnx_method: {
        type: String,
    },
    refund_st: {
        type: Number,
        default: 0
    },
    is_auto: {
        type: Boolean,
        default: false
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

module.exports = { OrderSummary: mongoose.model('OrderSummary', OrderSummarySchema) };