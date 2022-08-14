const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameSchema = Schema({
    name: {
        type: String
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    sub_category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    prod_type: {
        type: Number,
        default: 0
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country'
    },
    sku: {
        type: String,
    },
    prod_image: {
        type: String,
    },
    meta_title: {
        type: String,
    },
    meta_keywords: {
        type: String,
    },
    mets_desc: {
        type: String,
    },
    description: {
        type: String,
    },
    units: {
        type: Number,
    },
    company_expence: {
        type: Number,
    },
    gst_percent: {
        type: Number,
    },
    gst_amount: {
        type: Number,
    },
    pck_chrgs: {
        type: Number,
    },
    seller_disc: {
        type: Number,
    },
    courier_chr: {
        type: Number,
    },
    gst_trnx_fees: {
        type: Number,
    },
    others_taxes: {
        type: Number,
    },
    points: {
        type: Number,
    },
    auto_points: {
        type: Number,
    },
    commision: {
        type: Number,
    },
    auto_rcycle_comm: {
        type: Number,
    },
    status: {
        type: Number,
    },
    final_price: {
        type: Number,
    },
    auto_rcycle: {
        type: Number,
    },
    points_val_days: {
        type: Number,
    },
    auto_points_val_days: {
        type: Number,
    },
    points_switch: {
        type: Number,
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

const Game = module.exports = mongoose.model('Game', GameSchema);