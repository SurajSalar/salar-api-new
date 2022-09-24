const _ = require("lodash");

const Controller = require("../base");
const { Sellers } = require('../../models/s_sellers');
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const Services = require('../../utilities/index');



class SellersController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }


    /********************************************************
   Purpose: seller signUp
   Parameter:
      {
          "fullName":"salarseller",
          "dob":"01-01-2000",
          "gender":"male",
          "emailId":"salarseller@gmail.com",
          "country":"India",
          "mobileNo":"9999999999",
          "password":"Test@123"
      }

   Return: JSON String
   ********************************************************/
    async signUp() {
        try {
            let fieldsArray = this.req.body.role = ["fullName", "dob", "gender", "emailId", "country", "mobileNo", "password",];
            let emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if (this.req.body.fullName) {
                const validateName = await this.commonService.nameValidation(this.req.body.fullName);
                if (!validateName) {
                    return this.res.send({ status: 0, message: "Please send proper fullName" });
                }
            }
            const validateEmail = await this.commonService.emailIdValidation(this.req.body.emailId);
            if (!validateEmail) {
                return this.res.send({ status: 0, message: "Please send proper emailId" });
            }
            const validateMobileNo = await this.commonService.mobileNoValidation(this.req.body.mobileNo);
            if (!validateMobileNo) {
                return this.res.send({ status: 0, message: "Mobile number should have 10 digits" });
            }
            const validatePassword = await this.commonService.passwordValidation(this.req.body.password);
            if (!validatePassword) {
                return this.res.send({ status: 0, message: "Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character" });
            }
            // check if Seller exists with mobile no and emailId
            const validateSeller = await Sellers.findOne({ $or: [{ "mobileNo": this.req.body.mobileNo }, { "emailId": this.req.body.emailId }] });
            console.log('validateSeller is ', validateSeller)
            if (validateSeller) {
                let sellers = await Sellers.find();
                return this.res.send({ status: 0, message: "EmailId/Mobile already exists", data: { sellers } });
            }
            else {
                let data = this.req.body;
                const transactionPassword = await this.commonService.randomTextGenerator(12);
                const encryptedPassword = await this.commonService.ecryptPassword({ password: data['password'] });
                data = { ...data, password: encryptedPassword, transactionPassword };
                data['emailId'] = data['emailId'].toLowerCase();
                let sellersCount = await Sellers.count();
                if (sellersCount <= 8) {
                    sellersCount = '0' + (sellersCount + 1);
                }
                const randomText = await this.commonService.randomTextGenerator(8)
                data['registerId'] = 'SL' + randomText + sellersCount
                // save new seller
                const newSeller = await new Model(Sellers).store(data);
                console.log('newSeller is ', newSeller)
                // if empty not save seller details and give error message.
                if (_.isEmpty(newSeller)) {
                    return this.res.send({ status: 0, message: "Seller not saved" })
                }
                else {
                    // Sending email
                    let mailStatus = await this.services.sendEmail(newSeller.emailId, "Salar", '', `<html><body><h2>HI! ${newSeller.fullName} you have successfully registered with salar</h2><strong>RegisteredId</strong>: ${newSeller.registerId} </br> <strong>Transaction password:</strong> ${transactionPassword}<h3></h3></body></html>`)
                    console.log('mailStatus ', mailStatus)
                    const message = `Dear ${newSeller.fullName}, Welcome to www.salar.in Your Seller ID is ${newSeller.registerId}, Your Password is ${transactionPassword}, Regards Strawberri World Solutions Private Limited.";`
                    // Sending message
                    let fetchSmsStatus = await this.services.sendSignupConfirmation(newSeller.mobileNo, message)
                    console.log('fetchSmsStatus ', fetchSmsStatus)
                    return this.res.send({ status: 1, message: "Seller registered Successfully" });
                }

            }
        } catch (error) {
            console.log("error = ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }

    }

    /********************************************************
    Purpose: SignIn
    Parameter:
        {
            "sellerId":"emailId" or registerId
            "password":"123456"
        }
    Return: JSON String
   ********************************************************/
    async signIn() {
        try {
            const fieldsArray = ["password"];
            const data = this.req.body;
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if (!data.emailId && !data.registerId) {
                return this.res.send({ status: 0, message: "Please send either registerId or emailId of seller" });
            }
            const sellerObj = { isDeleted: false, status: true }
            data.emailId ? sellerObj['emailId'] = data.emailId : sellerObj['registerId'] = data.registerId;
            const seller = await Sellers.findOne(sellerObj);
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Seller not exists or deleted" });
            }
            const status = await this.commonService.verifyPassword({ password: data.password, savedPassword: seller.password });
            if (!status) {
                return this.res.send({ status: 0, message: "Invalid password" });
            }
            const sellerDetails = await Sellers.findById(seller._id).select({ password: 0, __v: 0, transactionPassword: 0 });
            const { token } = await this.authentication.createToken({ id: seller._id, role: sellerDetails.role,  ipAddress: this.req.ip, device: this.req.device.type, action: "Login"});
            return this.res.send({ status: 1, message: "Login Successful", access_token: token, data: sellerDetails });
        } catch (error) {
            console.log(error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
   Purpose: Forgot password mail
   Parameter:
       {
           "sellerId":"emailId" or registerId
       }
   Return: JSON String
  ********************************************************/
    async forgotPassword() {
        try {
            const data = this.req.body;
            if (!data.sellerId) {
                return this.res.send({ status: 0, message: "Please send sellerId" });
            }
            const sellerObj = data.emailId ? { $or: [{ emailId: data.emailId.toString().toLowerCase() }, { registerId: data.sellerId }] } : { registerId: data.sellerId }
            sellerObj['isDeleted'] = false; sellerObj['status'] = true
            const seller = await Sellers.findOne(sellerObj);
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Seller not exists or deleted" });
            }
            const token = await this.authentication.generateToken();
            await Sellers.findByIdAndUpdate(seller._id, { forgotToken: token, forgotTokenCreationTime: new Date() });
            // Sending email
            await this.services.sendEmail(seller.emailId, "Salar", '', `<html><body><h2>HI! ${seller.fullName} you have requested for a password change</h2><h3>Please click on the <a href="www.salar.in/forgotToken=${token}">link</a> to change your password</h3><strong>RegisteredId</strong>: ${seller.registerId} </br> <strong>Transaction password:</strong> ${seller.transactionPassword}<h3></h3></body></html>`)
            const message = `Dear ${seller.fullName}, Welcome to www.salar.in Your Seller ID is ${seller.registerId}, Your Password is ${seller.transactionPassword}, Regards Strawberri World Solutions Private Limited.";`
            // Sending message
            await this.services.sendSignupConfirmation(seller.mobileNo, message)
            return this.res.send({ status: 1, message: "Please check your registered email" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
  Purpose: Reset password
  Parameter:
      {
          "password":"123456",
          "token": "errrrwqqqsssfdfvfgfdewwwww"
      }
  Return: JSON String
 ********************************************************/
    async resetPassword() {
        try {
            const seller = await Sellers.findOne({ forgotToken: this.req.body.token });
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Invalid token" });
            }
            const validatePassword = await this.commonService.passwordValidation(this.req.body.password);
            if (!validatePassword) {
                return this.res.send({ status: 0, message: "Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character" });
            }
            let password = await this.commonService.ecryptPassword({ password: this.req.body.password });

            const updateSeller = await Sellers.findByIdAndUpdate(seller._id, { password: password }, { new: true });
            if (_.isEmpty(updateSeller)) {
                return this.res.send({ status: 0, message: "Password not updated" });
            }
            return this.res.send({ status: 1, message: "Password updated successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}
module.exports = SellersController;