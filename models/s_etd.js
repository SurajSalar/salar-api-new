const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const etdSchema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, ref: 'Sellers' },
    name: { type: String },
    gstNo: { type: String},
    gstImage: { type: String },
    panImage: { type: String },
    panNo: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: ['Approved', 'Rejected', 'Pending'], default:"Pending" },
    remarks: { type: String }
},
    { timestamps: true });

const EtdDetails = mongoose.model('etd', etdSchema);

module.exports = {
    EtdDetails: EtdDetails,
}
