const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const AdvertisementSchema = new Schema({
    positionId: {type: Schema.Types.ObjectId, ref: 'ad_positions'},
    categoryPage: { type: String }, 
    productPage: { type: String }, 
    userPortal: { type: String, enum: ['Dashboard', 'Side Bar'] }, 
    sliderNo: { type: Number }, 
    title: { type: String }, 
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' }, 
    storeId: { type: Schema.Types.ObjectId, ref: 'stores' }, 
    pageLink: { type: String }, 
    file: { type: String }, 
    startDate: { type: String }, 
    endDate: { type: String }, 
    registerId: { type: String },
    isDeleted: { type: Boolean, default: false},
    status: { type: Boolean, default: true},
    approvalStatus: { type: String, enum: ['Approved', 'Rejected', 'Pending'], default:"Pending" },
    reason: { type: String },
},
    { timestamps: true });

const Advertisements = mongoose.model('advertisements', AdvertisementSchema);

module.exports = {
    Advertisements: Advertisements,
}

