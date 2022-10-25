const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const AdminSchema = new Schema({
    fullName: { type: String },
    dob: { type: String  },
    gender:  { type: String, enum : ['male','female']},
    age: {type: String },
    email: { type: String, required: true },
    country: { type: String },
    mobileNo: { type: String },
    password: { type: String },
    sponserId: { type: String },
    registerId: { type: String },
    registerYear: { type: String },
    transactionPassword: { type: String },
    status: { type: Boolean, default: true },
    role: { type: String , enum: ['admin', 'staff']},
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = {
    Admin,
    AdminSchema
}