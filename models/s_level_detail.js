const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LevelSchema = Schema({
    game_prod_id: {
        type: Schema.Types.ObjectId,
        ref: 'GameProduct'
    },
    level: {
        type: Number,
        required: true
    },
    commission: {
        type: Number
    },
    reward: {
        type: Number
    },
    shopping_amount: {
        type: Number
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

module.exports = { Level: mongoose.model('Level', LevelSchema) };