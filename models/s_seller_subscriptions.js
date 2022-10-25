const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const SellerSubscriptionsSchema = new Schema({
    subscriptionId: {type: Schema.Types.ObjectId, ref: 'subscriptions'},
    sellerId: {type: Schema.Types.ObjectId, ref: 'sellers'},
    orderId: { type: String },
    paymentType: { type: String},
    fromDate: { type: Date },
    toDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    status: { type: String }
},{ timestamps: true });

const SellerSubscriptions = mongoose.model('seller_subscriptions', SellerSubscriptionsSchema);

module.exports = {
    SellerSubscriptions: SellerSubscriptions,
}
