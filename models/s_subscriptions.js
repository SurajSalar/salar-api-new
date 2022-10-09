const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const SubscriptionsSchema = new Schema({
    packageName: { type: String },
    amount: { type: Number },
    productsLimit: { type: Number },
    duration: { type: Number },
    logo: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true }
},{ timestamps: true });

const Subscriptions = mongoose.model('subscriptions', SubscriptionsSchema);

module.exports = {
    Subscriptions: Subscriptions,
}
