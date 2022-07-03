 const Schema = require('mongoose').Schema;
 const mongoose = require('mongoose');
 
 const kycSchema = new Schema({
     userId: { type: Schema.Types.ObjectId, ref: 'Users' },
     selectId: { type: String, enum : ['Driving License','Aadhar Card', 'Passport', 'Voter ID', 'SSN'] },
     numberProof: { type: String},
     imageProof: { type: String },
     organisationName: { type: String },
     roleInOrganisation: { type: String },
     organisationCertificateNumber: { type: String },
     isDeleted: { type: Boolean, default: false }
 },
     { timestamps: true });
 
 const KycDetails = mongoose.model('kyc', kycSchema);
 
 module.exports = {
     KycDetails: KycDetails,
 }
 
 