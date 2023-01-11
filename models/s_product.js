/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = Schema({
  name: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  sub_category: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  child_category: {
    type: Schema.Types.ObjectId,
    ref: "ChildCategory",
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  prod_image: {
    type: String,
  },
  gallary_image: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  long_description: {
    type: String,
  },
  min_purchase_qty: {
    type: Number,
  },
  max_purchase_qty: {
    type: Number,
  },
  seller_type: {
    type: String,
  },
  sku: {
    type: String,
  },
  barcode: {
    type: String,
  },
  product_variant: {
    type: String,
    enum: ["simple", "variant"],
  },
  variant_name: {
    type: String,
    default: null,
  },
  variant_color: [{
    type: Schema.Types.ObjectId,
    ref: "Unit",
  }],
  variant_size: [{
   type: Schema.Types.ObjectId,
    ref: "Unit",
  }],
  variant_type: [{
    type: String,
    default: null,
  }],
  unit_price: {
    type: Number,
  },
  commision: {
    type: Number,
  },
  gst_percent: {
    type: Number,
  },
  gst_amount: {
    type: Number,
  },
  final_price: {
    type: Number,
  },
  your_net_amount: {
    type: Number,
  },
  discount_type: {
    type: String,
    enum: ["flat", "percentage"],
  },
  enter_discount: {
    type: Number,
  },
  offer_price: {
    type: Number,
  },
  your_net_amount_aft_dis: {
    type: Number,
  },
  length: {
    type: Number,
    default: null,
  },
  breadth: {
    type: Number,
    default: null,
  },
  height: {
    type: Number,
    default: null,
  },
  weight: {
    type: Number,
    default: null,
  },
  key_features: [
    {
      keyword: String,
      text: String,
    },
  ],
  courier_chr: {
    type: Number,
  },
  pck_chrgs: {
    type: Number,
  },
  handling_chrgs: {
    type: Number,
  },
  sponsor_commission: {
    type: Number,
  },
  discout_point_aplicable: {
    type: Number,
  },
  return_applicable: {
    type: Number,
  },
  cancel_chrgs: {
    type: Number,
  },
  refund_applicable: {
    type: Number,
  },
  refund_amount: {
    type: Number,
  },
  replacement_applicable: {
    type: Number,
  },
  replacement_day: {
    type: Number,
  },
  delivery_location: {
    type: Schema.Types.ObjectId,
    ref: "Country",
  },
  shipping_day: {
    type: Number,
  },
  attributes: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  low_stock_warning: {
    type: Number,
  },
  featured_product: {
    type: Number,
  },
  status: {
    type: Number,
  },
  meta_title: {
    type: String,
  },
  meta_keywords: {
    type: String,
  },
  mets_desc: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Product = (module.exports = {
  Product: mongoose.model("Product", ProductSchema),
});
