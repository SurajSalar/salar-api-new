const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const address = new Schema({
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: Number, trim: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country' },
    state: { type: String, trim: true },
});

const StoreSchema = new Schema({
    name: { type: String },
    logo: { type: String },
    banner: { type: String },
    mobileNo: { type: String },
    whatsappNo: { type: String },
    emailId: { type: String },
    registerId: { type: String },
    storeAddress: address,
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    approvalStatus: { type: String, enum: ['Approved', 'Rejected', 'Pending'], default:"Pending" },
    remarks: { type: String },
},{ timestamps: true });

const Stores = mongoose.model('stores', StoreSchema);

module.exports = {
    Stores: Stores,
}
