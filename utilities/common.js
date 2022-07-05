/****************************
 Common services
 ****************************/
 const _ = require("lodash");
 const bcrypt = require('bcrypt');
 
 class Common{
        /********************************************************
    Purpose: Encrypt password
    Parameter:
        {
            "data":{
                "password" : "test123"
            }
        }
    Return: JSON String
    ********************************************************/
    ecryptPassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data && data.password) {
                    let password = bcrypt.hashSync(data.password, 10);
                    return resolve(password);
                }
                return resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async passwordValidation(password){
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{0,15}.*$/;
        if(password.match(passwordRegex)) {
          return true;
        }
       return false
    }

    async mobileNoValidation(mobileNo) {
        const mobileNoRegex = /^[0-9]{10}$/;
        if(mobileNo.match(mobileNoRegex)) {
          return true;
        }
       return false
      }

    async emailIdValidation(emailId) {
        const emailIdRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
        if(emailId.match(emailIdRegex)) {
            return true;
        }
        return false
    }

    async nameValidation(fullName) {
        const fullNameRegex = /^[a-zA-Z]{0,30}.*$/;
        if(fullName.match(fullNameRegex)) {
            return true;
        }
        return false
    }

    async zipCodeValidation(zipCode, country) {
        const zipCodeRegex = country == 'India' ? /^\d{6}$/: /^[\w\-\s]+$/;
        if(zipCode.match(zipCodeRegex)) {
            return true;
        }
        return false
    }

    async aadharCardValidation(aadharCard) {
        const aadharCardRegex = /^\d{12}$/;
        if(aadharCard.match(aadharCardRegex)) {
            return true;
        }
        return false
    }

    async passportValidation(passport) {
        const passportRegex = /^[a-zA-Z]{12}.*$/;
        if(passport.match(passportRegex)) {
            return true;
        }
        return false
    }

    async voterIdValidation(voterId) {
        const voterIdRegex = /^[a-zA-Z]{10}.*$/;
        if(voterId.match(voterIdRegex)) {
            return true;
        }
        return false
    }

    async SSNValidation(SSN) {
        const SSNRegex = /^\d{3}-?\d{2}-?\d{4}$/;
        if(SSN.match(SSNRegex)) {
            return true;
        }
        return false
    }

    async drivingLicenseValidation(drivingLicense) {
        const drivingLicenseRegex = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
        if(drivingLicense.match(drivingLicenseRegex)) {
            return true;
        }
        return false
    }

    async GSTValidation(GST) {
        const GSTRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if(GST.match(GSTRegex)) {
            return true;
        }
        return false
    }

    async accountNumberValidation(accountNumber) {
        const accountNumberRegex = /^\d{9,17}$/;
        if(accountNumber.match(accountNumberRegex)) {
            return true;
        }
        return false
    }

    async IBANNumberValidation(IBANNumber) {
        const IBANNumberRegex = /^([a-zA-Z0-9_-]){38}$/;
        if(IBANNumber.match(IBANNumberRegex)) {
            return true;
        }
        return false
    }

    async IBANNumberValidation(IBANNumber) {
        const IBANNumberRegex = /^([a-zA-Z0-9_-]){38}$/;
        if(IBANNumber.match(IBANNumberRegex)) {
            return true;
        }
        return false
    }

    async IFSCCodeValidation(IFSCCode) {
        const IFSCCodeRegex = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;
        if(IFSCCode.match(IFSCCodeRegex)) {
            return true;
        }
        return false
    }

    async swiftCodeValidation(swiftCode) {
        const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        if(swiftCode.match(swiftCodeRegex)) {
            return true;
        }
        return false
    }

    async panCardValidation(panCard) {
        const panCardRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        if(panCard.match(panCardRegex)) {
            return true;
        }
        return false
    }
    /********************************************************
    Purpose: Compare password
    Parameter:
        {
            "data":{
                "password" : "Buffer data", // Encrypted password
                "savedPassword": "Buffer data" // Encrypted password
            }
        }
    Return: JSON String
    ********************************************************/
    verifyPassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let isVerified = false;
                if (data && data.password && data.savedPassword) {
                    // bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
                    //     // result == true
                    // });
                    isVerified = await bcrypt.compare(data.password, data.savedPassword)
                }
                return resolve(isVerified);
            } catch (error) {
                reject(error);
            }
        });
    }

    async randomTextGenerator(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }


     /********************************************************
     Purpose: Change password validations
     Parameter:
     {
     }
     Return: JSON String
    ********************************************************/
     changePasswordValidation(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const passwordObj = data.passwordObj ? data.passwordObj : {}
                const samePassword = _.isEqual(passwordObj.oldPassword, passwordObj.newPassword);
                if (samePassword) {
                    return resolve({ status: 0, message: "Current password and new password should be different" });
                }

                const status = await this.verifyPassword({ password: passwordObj.oldPassword, savedPassword: passwordObj.savedPassword });
                if (!status) {
                    return resolve({ status: 0, message: "Please enter correct current password" });
                }

                const isPasswordValid = await this.passwordValidation(passwordObj.newPassword);
                if (!isPasswordValid) {
                    return resolve({ status: 0, message: "Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character" });
                }

                const password = await this.ecryptPassword({ password: passwordObj.newPassword });
                return resolve(password);
            } catch (error) {
                return reject(error);
            }
        });
    }

     /********************************************************
     Purpose: Change transaction password validations
     Parameter:
     {
     }
     Return: JSON String
    ********************************************************/
     changeTransactionPasswordValidation(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const passwordObj = data.passwordObj ? data.passwordObj : {}
                const samePassword = _.isEqual(passwordObj.oldTransactionPassword, passwordObj.newTransactionPassword);
                if (samePassword) {
                    return resolve({ status: 0, message: "Current transaction password and new transaction password should be different" });
                }

                if (passwordObj.savedTransactionPassword != passwordObj.oldTransactionPassword) {
                    return resolve({ status: 0, message: "Please enter correct current transaction password" });
                }

                const isPasswordValid = await this.passwordValidation(passwordObj.newTransactionPassword);
                if (!isPasswordValid) {
                    return resolve({ status: 0, message: "Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character" });
                }
                return resolve(passwordObj.newTransactionPassword);
            } catch (error) {
                return reject(error);
            }
        });
    }

 }
 module.exports = Common;