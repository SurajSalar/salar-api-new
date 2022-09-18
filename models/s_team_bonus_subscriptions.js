const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const TeamBonusSubscriptionsSchema = new Schema({
    name: { type: String },
    type: { type: String },
    GSTPercentage: { type: Number },
    price: { type: Number },
    points: { type: Number },
    pointsValidity: { type: Number},
    code: { type: String },
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

const TeamBonusSubscriptions = mongoose.model('teambonussubscriptions', TeamBonusSubscriptionsSchema);

module.exports = {
    TeamBonusSubscriptions: TeamBonusSubscriptions,
}
