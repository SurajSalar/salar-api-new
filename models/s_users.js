var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = new schema({
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
    role: { type: String , enum: ['individual', 'organisation']},
}, {
    timestamps: true
});


const Users = mongoose.model('User', UserSchema);
module.exports = {
    Users,
    UserSchema
}