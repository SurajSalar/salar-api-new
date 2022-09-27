const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const signatureSchema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
    uploadSignature: { type: String},
    drawSignature: { type: String },
    transactionPassword: { type: String }
},
    { timestamps: true });

const SignatureDetails = mongoose.model('signature', signatureSchema);

module.exports = {
    SignatureDetails: SignatureDetails,
}

