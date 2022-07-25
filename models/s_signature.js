const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const signatureSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Sellers' },
    uploadSignature: { type: String},
    drawSignature: { type: String },
    transactionPassword: { type: String }
},
    { timestamps: true });

const SignatureDetails = mongoose.model('signature', signatureSchema);

module.exports = {
    SignatureDetails: SignatureDetails,
}

