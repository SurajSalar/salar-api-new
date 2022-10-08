const mongoose = require('mongoose');
const schema = mongoose.Schema;

const address = new schema({
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: Number, trim: true },
    countryId: { type: schema.Types.ObjectId, ref: 'Country' },
    state: { type: String, trim: true },
});

const SellerSchema = new schema({
    fullName: { type: String },
    dob: { type: String  },
    image: { type: String  },
    gender:  { type: String, enum : ['male','female']},
    age: {type: String },
    emailId: { type: String, required: true },
    countryId: { type: schema.Types.ObjectId, ref: 'Country' },
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
    mailingAddress: address,
    otp: { type: String },
    wallet: { type: Number, default: 0 },
}, {
    timestamps: true
});


const Sellers = mongoose.model('Seller', SellerSchema);
module.exports = {
    Sellers,
    SellerSchema
}