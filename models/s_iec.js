const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const iecSchema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, ref: 'Sellers' },
    iecLicenseNo: { type: String},
    iecLicenseDoc: { type: String },
    isDeleted: { type: Boolean, default: false}
},
    { timestamps: true });

const IecDetails = mongoose.model('iec', iecSchema);

module.exports = {
    IecDetails: IecDetails,
}

