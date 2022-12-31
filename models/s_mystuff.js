/** @format */

const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const PointsSchema = new Schema(
  {
    dataOfPurchase: { type: String },
    productType: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    productName: { type: String },
    finalPrice: { type: Number },
    purchasedType: { type: String },
    recievedPoints: { type: String },
    validFrom: { type: String },
    validTo: { type: String },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Points = mongoose.model("Points", PointsSchema);

const RewardsSchema = new Schema(
  {
    dataOfPurchase: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    productName: { type: String },
    rewardFor: { type: String },
    achievedDate: { type: String },
    status: { type: String },
    details: { type: String },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Rewards = mongoose.model("Rewards", RewardsSchema);

const OffersSchema = new Schema(
  {
    date: { type: String },
    offersDeals: { type: String },
    validTill: { type: String },
    status: { type: String },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Offers = mongoose.model("Offers", OffersSchema);

const CCDCSchema = new Schema(
  {
    date: { type: String },
    txnNo: { type: String },
    credited: { type: Number },
    debited: { type: Number },
    type: { type: String },
    purpose: { type: String },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const CCDC = mongoose.model("CCDC", CCDCSchema);

const ShippingAmountSchema = new Schema(
  {
    dataOfPurchase: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    productName: { type: String },
    genCode: { type: String },
    commissionName: { type: String },
    commissionType: { type: String },
    commissionLevel: { type: Number },
    shoppingAmount: { type: Number },
    levelCommissionEarned: { type: Number },
    requiredMembers: { type: Number },
    joinedMembers: { type: Number },
    membershipStatus: { type: String },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const ShippingAmount = mongoose.model("ShippingAmount", ShippingAmountSchema);

module.exports = {
  Points: Points,
  Rewards: Rewards,
  ShippingAmount: ShippingAmount,
  CCDC: CCDC,
  Offers: Offers,
};
