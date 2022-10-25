const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const SellerBrandsSchema = new Schema({
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
    subCategoryId: {type: Schema.Types.ObjectId, ref: 'SubCategory'},
    childCategoryId: {type: Schema.Types.ObjectId, ref: 'ChildCategory'},
    brandId: {type: Schema.Types.ObjectId, ref: 'Brand'},
    stock: { type: Number },
    registerId: { type: String },
    isDeleted: { type: Boolean, default: false},
    status: { type: Boolean, default: true},
    remarks: { type: String },
    approvalStatus: { type: String, enum: ['Approved', 'Rejected', 'Pending'], default:"Pending" },
},
    { timestamps: true });

const SellerBrands = mongoose.model('seller_brands', SellerBrandsSchema);

module.exports = {
    SellerBrands: SellerBrands,
}

