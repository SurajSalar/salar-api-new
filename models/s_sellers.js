const mongoose = require('mongoose');
const schema = mongoose.Schema;

const address = new schema({
    name: { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: { type: Number, trim: true },
    mobileNo: { type: String, trim: true },
    emailId: { type: String, trim: true },
    country: { type: String, trim: true },
    GST: { type: String, trim: true },
    defaultAddress: { type: Boolean, trim: true, default: false }
});

const SellerSchema = new schema({
    fullName: { type: String },
    dob: { type: String  },
    gender:  { type: String, enum : ['male','female']},
    age: {type: String },
    emailId: { type: String, required: true },
    country: { type: String },
    mobileNo: { type: String },
    password: { type: String },
    transactionPassword: { type: String },
    sponserId: { type: String },
    registerId: { type: String },
    organisationName: { type: String },
    registerYear: { type: String },
    termsAndConditions: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    forgotToken: { type: String },
    forgotTokenCreationTime: { type: Date },
    // role: { type: String , enum: ['individual', 'organisation']},
    shippingAddresses: [address],
}, {
    timestamps: true
});


const Sellers = mongoose.model('Seller', SellerSchema);
module.exports = {
    Sellers,
    SellerSchema
}