
const { AccessTokens } = require('../models/s_auth');

class Authorization {
    static async isAuthorised(req, res, next) {
        let token = req.headers["x-access-token"] || req.headers["authorization"];
        token = token ? token.split(" ")[1] : false;
        //if no token found, return response (without going to the next middelware)
        if (!token) return res.send({ status: 0, message: "Access denied. No token provided." })
        try {
            //if can verify the token, set req.user and pass to next middleware
            const access_token = await AccessTokens.findOne({ token: token });
            if (access_token.role != 'individual' && access_token.role != 'organisation') {
                return res.send({ status: 0, message: "Access denied. Not a user" })
            }
            if (access_token) {
                req.user = access_token.userId;
                next();
            } else {
                return res.send({ status: 0, message: "Access denied. Token Expired." })
            }
        } catch (ex) {
            //if invalid token
            console.log(ex)
            return res.send({ status: 0, message: "Invalid token." })
        }
    }
    static async isAdminAuthorised(req, res, next) {
        let token = req.headers["x-access-token"] || req.headers["authorization"];
        token = token ? token.split(" ")[1] : false;
        //if no token found, return response (without going to the next middelware)
        if (!token) return res.status(401).send({ status: 0, message: "Access denied. No token provided." })
        try {
            //if can verify the token, set req.user and pass to next middleware
            const access_token = await AccessTokens.findOne({ token: token });
            if (access_token) {
                if (access_token.role != 'admin') {
                    return res.status(401).send({ status: 0, message: "Access denied. Not an admin user" })
                }
                req.user = access_token.userId;
                next();
            } else {

                return res.status(401).send({ status: 0, message: "Access denied. Token Expired." })
            }


        } catch (ex) {
            //if invalid token
            console.log(ex)
            return res.status(500).send({ status: 0, message: "Invalid token." })
        }
    }
}

module.exports = Authorization;