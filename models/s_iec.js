const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const iecSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Sellers' },
    iecLicenseNo: { type: String},
    iecLicenseDoc: { type: String }
},
    { timestamps: true });

const IecDetails = mongoose.model('iec', iecSchema);

module.exports = {
    IecDetails: IecDetails,
}

