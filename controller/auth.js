const _ = require("lodash");
const crypto = require('crypto');
const moment = require('moment');

const Controller = require('./base');
const { AccessTokens } = require('../models/s_auth')
const Model = require("../utilities/model");


class AuthController extends Controller {
    constructor() {
        super();
    }

    async createToken(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const token = crypto.randomBytes(64).toString('hex');
                const refreshToken = crypto.randomBytes(64).toString('hex');
                data.token = token;
                data.userId = data.id;
                data.refreshToken = refreshToken;
                data.tokenExpiryTime = moment().add(parseInt(540), 'minutes');
                data.refreshTokenExpiryTime = moment().add(parseInt(720), 'minutes');
                data.role = data.role;
                delete data.id;
                const auth = await AccessTokens.findOne({ token: {$ne: ""}, userId: data.userId });
                if (!_.isEmpty(auth)) {
                    await AccessTokens.findByIdAndUpdate(auth._id, { token: "",refreshToken:"", action: 'Relogged' }, { new: true })
                }
                await new Model(AccessTokens).store(data);
                return resolve({ token, refreshToken });
            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }
        })
    }

    async createAdminToken(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const token = crypto.randomBytes(64).toString('hex');
                const refreshToken = crypto.randomBytes(64).toString('hex');
                data.token = token;
                data.adminId = data.id;
                data.refreshToken = refreshToken;
                data.tokenExpiryTime = moment().add(parseInt(540), 'minutes');
                data.refreshTokenExpiryTime = moment().add(parseInt(720), 'minutes');
                data.role = data.role;
                delete data.id;
                const auth = await AccessTokens.findOne({ token: {$ne: ""}, adminId: data.adminId });
                if (!_.isEmpty(auth)) {
                    await AccessTokens.findByIdAndUpdate(auth._id, { token: "",refreshToken:"", action: 'Relogged' }, { new: true })
                }
                await new Model(AccessTokens).store(data);
                return resolve({ token, refreshToken });
            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }
        })
    }

    async verifyRefreshToken(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let authData = await AccessTokens.findOne({
                    refreshToken: data.refreshToken, refreshTokenExpiryTime: {
                        $gt: moment(),
                    }
                });
                if (_.isEmpty(authData)) {
                    reject({ status: 0, message: "Invalid Refresh Token" })
                }
                
                return resolve({ id: authData.userId, role: authData.role });
            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }
        })
    }
    
    async verifyAdminRefreshToken(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let authData = await AccessTokens.findOne({
                    refreshToken: data.refreshToken, refreshTokenExpiryTime: {
                        $gt: moment(),
                    }
                });
                if (_.isEmpty(authData)) {
                    reject({ status: 0, message: "Invalid Refresh Token" })
                }
                
                return resolve({ id: authData.adminId, role: authData.role });
            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }
        })
    }
    

    async generateToken() {
        return new Promise(async (resolve, reject) => {
            try {
                const token = crypto.randomBytes(64).toString('hex');
                return resolve(token);
            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }

        });
    }
}
module.exports = AuthController;

