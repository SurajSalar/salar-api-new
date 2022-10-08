const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const AdPositionSchema = new Schema({
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
    position: { type: String , enum: ['User', 'Seller', 'Website']},
    sliders: [{image: String}],
    isDeleted: { type: Boolean, default: false},
    status: { type: Boolean, default: true}
},
    { timestamps: true });

const AdPositions = mongoose.model('ad_positions', AdPositionSchema);

module.exports = {
    AdPositions: AdPositions,
}

