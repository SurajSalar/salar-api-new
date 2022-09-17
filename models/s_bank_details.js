const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const BankDetailsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    fullName: { type: String},
    bankName: { type: String },
    accountNumber: { type: String },
    accountType: { type: String, enum: ['savings', 'current'] },
    IFSCCode: { type: String },
    branchName: { type: String },
    bankStatement: { type: String },
    IBANNumber: { type: String },
    swiftCode: { type: String },
    panCard: { type: String },
    nomineeName: { type: String },
    nomineeRelation: { type: String },
    nomineeMobileNo: { type: String },
    nomineeEmailId: { type: String },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true });

const BankDetails = mongoose.model('bankDetails', BankDetailsSchema);

module.exports = {
    BankDetails: BankDetails,
}

