/**************************
 AUTHENTICATION SCHEMA INITIALISATION
 **************************/
 const Schema = require('mongoose').Schema;
 const mongoose = require('mongoose');
 
 const accessTokenSchema = new Schema({
     userId: { type: Schema.Types.ObjectId, ref: 'Users' },
     adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
     token: { type: String },
     refreshToken: { type: String },
     action: { type: String, enum:["Login", "Logout"] },
     ipAddress: { type: String },
     role: { type: String },
     device: { type: String },
     tokenExpiryTime: { type: Date },
     refreshTokenExpiryTime: { type: Date }
 },
     { timestamps: true });
 
 const AccessTokens = mongoose.model('access_token', accessTokenSchema);
 
 module.exports = {
     AccessTokens: AccessTokens,
 }
 
 