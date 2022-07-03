
const  { AccessTokens } = require('../models/s_auth');

module.exports = async function (req, res, next) {
    //get the token from the header if present
    
    var token = req.headers["x-access-token"] || req.headers["authorization"];
    token = token ? token.split(" ")[1] : false;

    //if no token found, return response (without going to the next middelware)
    if (!token) return res.send({status:0, message: "Access denied. No token provided."})

    try {
        //if can verify the token, set req.user and pass to next middleware
        const access_token = await AccessTokens .findOne({ token: token });
        if (access_token) {
            req.user = access_token.userId;
            next();
        } else {
            res.send({status:0, message: "Access denied. Token Expired."})
        }
    } catch (ex) {
        //if invalid token
        console.log(ex)
        res.send({status:0, message: "Invalid token."})
    }
};