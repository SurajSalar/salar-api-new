const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MlmSchema = Schema({
   plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    },
    mlm:{
        type:Array
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

module.exports = { Mlm: mongoose.model('Mlm', MlmSchema) };