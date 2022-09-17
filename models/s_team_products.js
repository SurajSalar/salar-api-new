const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const TeamProductSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    teamLevelId: { type: Schema.Types.ObjectId, ref: 'teamlevels' },
    teamIncomePercentage: { type: Number },
    ULDownlineShare: { type: Number },
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

const TeamProducts = mongoose.model('teamproducts', TeamProductSchema);

module.exports = {
    TeamProducts: TeamProducts,
}
