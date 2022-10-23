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
    countryId: { type: schema.Types.ObjectId, ref: 'Country' },
    GST: { type: String, trim: true },
    defaultAddress: { type: Boolean, trim: true, default: false }
});

const UserSchema = new schema({
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
    otp: { type: String },
    termsAndConditions: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    role: { type: String , enum: ['regular', 'organisation']},
    shippingAddresses: [address],
}, {
    timestamps: true
});


const Users = mongoose.model('Users', UserSchema);
module.exports = {
    Users,
    UserSchema
}