const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const SellerCategoriesSchema = new Schema({
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
    subCategoryId: {type: Schema.Types.ObjectId, ref: 'SubCategory'},
    childCategoryId: {type: Schema.Types.ObjectId, ref: 'ChildCategory'},
    image: { type: String },
    registerId: { type: String },
    isDeleted: { type: Boolean, default: false},
    status: { type: Boolean, default: true},
    remarks: { type: String },
    approvalStatus: { type: String, enum: ['Approved', 'Rejected', 'Pending'], default:"Pending" },
},
    { timestamps: true });

const SellerCategories = mongoose.model('seller_categories', SellerCategoriesSchema);

module.exports = {
    SellerCategories: SellerCategories,
}

