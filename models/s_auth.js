/**************************
 AUTHENTICATION SCHEMA INITIALISATION
 **************************/
 var Schema = require('mongoose').Schema;
 var mongoose = require('mongoose');
 
 var accessTokenSchema = new Schema({
     userId: { type: Schema.Types.ObjectId, ref: 'Users' },
     adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
     token: { type: Buffer },
     refreshToken: { type: Buffer },
     role: { type: String },
     tokenExpiryTime: { type: Date }
 },
     { timestamps: true });
 
 var AccessTokens = mongoose.model('access_token', accessTokenSchema);
 
 module.exports = {
     AccessTokens: AccessTokens,
 }
 
 