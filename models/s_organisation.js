const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const organisationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    organisationName: { type: String },
    roleInOrganisation: { type: String },
    organisationCertificateNumber: { type: String },
    orgFrontImage: { type: String },
    orgBackImage: { type: String },
    status: { type: String, enum: ['Approved', 'Rejected', 'Pending'], default:"Pending" },
    remarks: { type: String },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true });

const OrgDetails = mongoose.model('orgdetails', organisationSchema);

module.exports = {
    OrgDetails: OrgDetails,
}

