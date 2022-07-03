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
     role: { type: String },
     tokenExpiryTime: { type: Date }
 },
     { timestamps: true });
 
 const AccessTokens = mongoose.model('access_token', accessTokenSchema);
 
 module.exports = {
     AccessTokens: AccessTokens,
 }
 
 