const _ = require("lodash");
const crypto = require('crypto');
const moment = require('moment');

const Controller = require('./base');
const { AccessTokens } = require('../models/s_auth')



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
                await AccessTokens.findOneAndUpdate({ userId: data.userId }, data, { upsert: true, new: true });
                return resolve({ token, refreshToken });
            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }
        })
    }

    async verfyRefreshToken(data) {
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

