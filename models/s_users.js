const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = Schema({
    full_name: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        // required: true,
        unique: true
    },
    mobile_no: {
        type: Number,
        // required: true,
    },
    gender: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true
    },
    parent_id: {
        type: String,
        // required: true
    },
    username: {
        type: String,
    },
    photo: {
        type: String
    },
    pincode: {
        type: String,
        default: ""
    },
    gst_no: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    transx_password: {
        type: String,
        default: ""
    },
    address_1: {
        type: String,
        default: ""
    },
    address_2: {
        type: String,
        default: ""
    },
    trnx_otp: {
        type: String,
        default: ""
    },
    dob: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    isLogin: {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    sudCategory: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],

});


const User = module.exports = mongoose.model('User', UserSchema);