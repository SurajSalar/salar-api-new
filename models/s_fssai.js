const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const fssaiSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Sellers' },
    licenseNo: { type: String},
    qrCode: { type: String },
    licenseDoc: { type: String },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true });

const FssaiDetails = mongoose.model('fssai', fssaiSchema);

module.exports = {
    FssaiDetails: FssaiDetails,
}

