const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const product = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    discountType: { type: String, enum: ["Amount", "Percentage"] },
    discount: { type: Number },
});
const DealsSchema = new Schema({
    title: { type: String },
    banner: { type: String },
    userLimit: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    pageLink: { type: String },
    products: [product],
    isDeleted: { type: Boolean, default: false},
    status: { type: Boolean, default: true}
},
    { timestamps: true });

const Deals = mongoose.model('deals', DealsSchema);

module.exports = {
    Deals: Deals,
}

