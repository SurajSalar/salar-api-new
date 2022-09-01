const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameProductSchema = Schema({
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
    games: [{
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }],
    prod_type: {
        type: Number,
        default: 0
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country'
    },
    hsnCode: {
        type: String,
    },
    description: {
        type: String,
    },

    unit_price: {
        type: Number
    },
    gst_percent: {
        type: Number,
    },
    gst_amount: {
        type: Number,
    },
    final_price: {
        type: Number,
    },

    prod_image: {
        type: String,
    },

    status: {
        type: Number,
    },

    auto_rcycle: {
        type: Number,
    },
    reward_rcycle: {
        type: Number,
    },
    shopping_amt_cycle: {
        type: Number,
    },

    sponsor_commision: {
        type: Number,
    },
    auto_rcycle_comm: {
        type: Number,
    },

    points: {
        type: Number,
    },
    auto_points: {
        type: Number,
    },
    points_val_days: {
        type: Number,
    },
    auto_points_val_days: {
        type: Number,
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
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// const GameProduct = module.exports = mongoose.model('GameProduct', GameProductSchema);
const GameProduct = mongoose.model('GameProduct', GameProductSchema);
module.exports = {
    GameProduct
}