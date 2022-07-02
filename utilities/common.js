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
                console.log(`data: ${JSON.stringify(data)}`)
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
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
 }
 module.exports = Common;