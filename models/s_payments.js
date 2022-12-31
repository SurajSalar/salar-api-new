const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = Schema({
  razorpay_order_id: String,
  razorpay_payment_id: String,
  order_id: String,
  payment_status: String,
  refund_status: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  final_price: Number,
});

module.exports = { Payments: mongoose.model("Payments", PaymentSchema) };
