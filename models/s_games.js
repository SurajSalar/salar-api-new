const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameSchema = Schema({
    name: {
        type: String
    },
    game_url: {
        type: String
    },
    status: {
        type: Number
    },
    image: {
        type: String,
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'GameCategory'
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

// const Game = module.exports = mongoose.model('Game', GameSchema);
const Game = mongoose.model('Game', GameSchema);
module.exports = {
    Game
}