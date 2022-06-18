const userType = require('../config/constant')
const db = require('../config/db')
const Role = require('../config/constant').Role

createAccessToken = async (data, callback) => {
    try {
        let token = await db['access_token'].findOneAndUpdate({
            userId: data.userId
        }, data,
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );
        console.log(token);
        return token

    } catch (error) {
        console.log("Error in create access token : ", error);
        return error
    }
}

createRefreshToken = async (data, callback) => {
    try {
        let token = await db['refresh_token'].findOneAndUpdate({
            userId: data.userId
        }, data,
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );
        console.log(token);
        // callback(token)
        return token
    } catch (error) {
        console.log("Error in create refresh token : ", error);
        // callback(error);
        return error
    }
}

createToken = (userId, role) => {
    const access_token = crypto.randomBytes(64).toString('hex');
    const refresh_token = crypto.randomBytes(64).toString('hex');
    createAccessToken({
        token: access_token,
        expire_date: new Date(Date.now() + (300 * 24 * 3600000)).toString(),
        userId: userId,
        client_id: null
    })
    createRefreshToken({
        token: refresh_token,
        expire_date: new Date(Date.now() + (300 * 24 * 3600000)).toString(),
        userId: userId,
        client_id: null
    });
    return { access_token, refresh_token, userId, role }
}

revokeToken = async (token) => {
    try {
        let refreshToken = await this.refreshRepository.findOne({ where: { token: token } });
        console.log(" <<<<<<<<<<<<<<<<<< Grant type Refresh Token >>>>>>>>>>>>>>> ", token);
        console.log(refreshToken);
        return refreshToken
    } catch (error) {
        console.log(`Error in revoke token : ${error}`)
    }
}

module.exports = {
    signUp: async (req, callback) => {
        try {
            let user = req.body;
            if (await db['user'].findOne({ email: user.email.toLowerCase() })) {
                callback(404, 'Email ' + user.email + ' is already taken')
            } else {
                if (await db['user'].findOne({ email: user.username })) {
                    callback(404, 'Username ' + user.username + ' is already taken')
                } else {
                    if (user.mobileNo) {
                        console.log(user.mobileNo);
                        var mobileValid = mobileNumberValidation(user.mobileNo);
                        if (mobileValid != true) {
                            callback(400, mobileValid);
                        } else {
                            let hashPassword = '';
                            var passValid = testPassword(user.password);
                            if (passValid != true) {
                                callback(400, passValid);
                            } else {
                                hashPassword = await bcrypt.hash(user.password, bs.saltRounds);
                                //end validation

                                const newUser = new db['user'](req.body);
                                newUser.password = hashPassword;
                                newUser.email = user.email.toLowerCase()
                                newUser.save()
                                    .then(async (userDetails) => {
                                        console.log(req.body.role);
                                        let user = {
                                            name: userDetails.full_name,
                                            userId: userDetails.id
                                        }
                                        if (req.body.role == userType.Role["Super-admin"]) {
                                            let super_admin = new db['super_admin'](user);
                                            await super_admin.save();
                                        }
                                        callback(200, 'Sign-Up Successfull');
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        callback(500, 'error in saving user details');
                                    });
                            }
                        }
                    } else {
                        callback(500, 'Please enter a valid mobile number');
                    }
                }
            }
        } catch (error) {
            console.log(error);
            callback(500, error.message, error);
        }
    },
    login: async (req, callback) => {
        try {
            var user = req.body
            let userEmail = null
            let socialId = user.id ? user.id : ""

            if (user.login_type) {
                if (user.login_type == "social_fb") {

                    let user_exists = await db['user'].findOne({ fb_id: socialId });
                    console.log(socialId)
                    if (user_exists) {
                        callback(200, "Login Successfull", createToken(user_exists._id, 1))
                    } else {
                        if (user.id) {
                            let newUser = new db['user']({});

                            newUser.full_name = user.name;
                            newUser.email = user.email
                            newUser.fb_id = user.id
                            newUser.save()
                                .then(user => {
                                    callback(200, "Login Successfull", createToken(user._id, 1))
                                })
                                .catch(error => {
                                    console.log(error)
                                    callback(500, "Login Failed : " + error.message, error)
                                })

                        } else {
                            console.log("Login Failed invalid credentials ")
                            callback(500, "Login Failed invalid credentials ", {})
                        }
                    }

                } else if (user.login_type == "social_google") {
                    let user_exists = await db['user'].findOne({ google_id: socialId });
                    if (user_exists) {
                        callback(200, "Login Successfull", createToken(user_exists._id, 1))
                    } else {
                        if (user.id) {
                            let newUser = new db['user']({});

                            newUser.full_name = user.name;
                            newUser.first_name = user.givenName;
                            newUser.last_name = user.familyName;
                            newUser.email = user.email;
                            newUser.photo = user.photo;
                            newUser.google_id = user.id;

                            newUser.save()
                                .then(user => {
                                    callback(200, "Login Successfull", createToken(user._id, 1))
                                })
                                .catch(error => {
                                    console.log(error)
                                    callback(500, "Login Failed : " + error.message, error)
                                })
                        } else {
                            console.log("Login Failed invalid credentials ")
                            callback(500, "Login Failed invalid credentials ", {})
                        }
                    }
                } else {
                    // callback(200, "Login Successfull", createToken(userEmail.id))
                }
            } else if (user.login_type == 'refresh_token') {

            } else {
                if (user.mobileNo) {
                    userEmail = await db['user'].findOne({ mobileNo: user.mobileNo });
                } else {
                    userEmail = await db['user'].findOne({ email: user.email.toLowerCase() });
                }
                console.log(userEmail)
                if (userEmail == null) {
                    callback(404, 'Email ' + req.body.email ? req.body.email : req.body.mobileNo + ' not found in db')
                } else {
                    if (userEmail.isActive == false) {
                        callback(404, 'Your Account is disabled please contact Administrator');
                    } else {
                        console.log(req.body)
                        if (userEmail.role == Role.User) {
                            if (user.password) {
                                if (await bcrypt.compare(user.password, userEmail.password)) {
                                    callback(200, "Login Successfull", createToken(userEmail.id, userEmail.role))
                                } else {
                                    callback(404, "Invalide Credentials")
                                }
                            } else {
                                let otp = Math.floor(1000 + Math.random() * 9000)
                                // let otp = 5005;
                                const loginOtp = await db['user'].findByIdAndUpdate(userEmail.id, {
                                    verification_otp: otp
                                })
                                console.log(loginOtp)
                                console.log(otp)
                                let sendSms = await textlocalComplete.sendSms('N2E2Yjc5Mzc3MTcwNjY3MzMxNzU1YTc4NDc1NzRhMzA=', req.body.mobileNo, 'GoodXI',
                                    `Dear User, Your OTP for login to GoodX is ${otp}. Valid for 10 minutes. Please do not share this OTP. Regards, GoodX Team`);
                                console.log(sendSms.data)
                                callback(200, "OTP Sent", {})
                            }
                        } else if (userEmail.role == Role["Super-admin"]) {
                            if (await bcrypt.compare(user.password, userEmail.password)) {
                                let super_admin = await db['super_admin'].findOne({ userId: userEmail.id })
                                if (super_admin) {
                                    callback(200, "Login Successfull", createToken(userEmail.id, userEmail.role))
                                } else {
                                    callback(400, "Super Admin not found", {})
                                }
                            } else {
                                callback(404, "Invalide Credentials")
                            }
                        } else if (userEmail.role == Role["Zonal-admin"]) {
                            if (await bcrypt.compare(user.password, userEmail.password)) {
                                let zonal_admin = await db['zonal_admin'].findOne({ userId: userEmail.id })
                                if (zonal_admin) {
                                    callback(200, "Login Successfull", createToken(userEmail.id, userEmail.role))
                                } else {
                                    callback(400, "Zonal Admin not found", {})
                                }
                            } else {
                                callback(404, "Invalide Credentials")
                            }
                        } else if (userEmail.role == Role["Agency-admin"]) {
                            if (await bcrypt.compare(user.password, userEmail.password)) {
                                let agency_admin = await db['agency_admin'].findOne({ userId: userEmail.id })
                                if (agency_admin) {
                                    callback(200, "Login Successfull", createToken(userEmail.id, userEmail.role))
                                } else {
                                    callback(400, "Agency Admin not found", {})
                                }
                            } else {
                                callback(404, "Invalide Credentials")
                            }
                        } else if (userEmail.role == Role["Service-man"]) {
                            if (await bcrypt.compare(user.password, userEmail.password)) {
                                let service_man = await db['service_man'].findOne({ userId: userEmail.id })
                                if (service_man) {
                                    callback(200, "Login Successfull", createToken(userEmail.id, userEmail.role))
                                } else {
                                    callback(400, "Service man not found", {})
                                }
                            } else {
                                callback(404, "Invalide Credentials")
                            }
                        } else {
                            callback(404, 'Your Account is disabled please contact Administrator');
                        }
                    }
                }
            }

        } catch (error) {
            console.log(error);
            callback(500, error.message, error);
        }
    },
    verifyOTP: async (req, callback) => {
        try {
            let verification_otp = null;
            let otp = req.body.login_otp;
            verification_otp = await db['user'].findOne({ mobileNo: req.body.mobileNo });
            if (otp && verification_otp.verification_otp) {
                console.log(otp, verification_otp.verification_otp)
                if (JSON.parse(otp) === verification_otp.verification_otp) {
                    callback(200, "Login Successfull", createToken(verification_otp.id, verification_otp.role))
                } else {
                    callback(400, "Invalid OTP", {})
                }
            } else {
                callback(404, "Invalid OTP")
            }
        } catch (error) {
            console.log("Error in verify otp ", error);
            callback(500, error.message, error);
        }
    }
}