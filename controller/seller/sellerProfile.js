const _ = require("lodash");
const { ObjectID, ObjectId } = require('mongodb');

const Controller = require("../base");
const { Sellers } = require('../../models/s_sellers');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');
const { Country } = require('../../models/s_country');


class SellerProfileController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
        this.services = new Services();
    }

     /********************************************************
    Purpose: Change Password
    Parameter:
    {
        "oldPassword":"Satya@123",
        "newPassword":"Test@123",
        "transactionPassword":"bCkQJl"
    }
    Return: JSON String
   ********************************************************/
    async changePassword() {
        try {
            const seller = this.req.user;
            console.log(`seller: ${seller}`)
            const data = this.req.body; 
            const fieldsArray = ["oldPassword", "newPassword", "transactionPassword"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }

            const sellerDetails = await Sellers.findOne({_id:seller, transactionPassword:data.transactionPassword },{password:1})
            if (_.isEmpty(sellerDetails)) {
                return this.res.send({ status: 0, message: "Seller not found" });
            }
            const passwordObj = {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                savedPassword: sellerDetails.password
            };
            const password = await this.commonService.changePasswordValidation({ passwordObj });
            if (typeof password.status !== 'undefined' && password.status == 0) {
                return this.res.send(password);
            }
            console.log(`seller_id: ${seller._id}`)
            const updatedSeller = await Sellers.findByIdAndUpdate(seller, { password: password}, { new: true });
            return !updatedSeller ? this.res.send({ status: 0, message: "Password not updated" }) : this.res.send({ status: 1, message: "Password updated successfully" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Change Transaction Password request
    Parameter:
    {
        "emailId":"lakshmimattafreelancer@gmail.com",
        "mobileNo":"7207334583"
    }
    Return: JSON String
   ********************************************************/
    async changeTransactionPasswordRequest() {
        try {
            const seller = this.req.user;
            const data = this.req.body; 
            const fieldsArray = ["emailId", "mobileNo"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const sellerDetails = await Sellers.findOne({ _id:seller, emailId: data.emailId, mobileNo: data.mobileNo},{fullName:1,organisationName:1, countryId:1, role:1, mobileNo:1, emailId:1, registerId:1}).populate('countryId',{name:1});
            if (_.isEmpty(sellerDetails)) {
                return this.res.send({ status: 0, message: "Seller not found" });
            }
            const otp =  await this.commonService.randomGenerator(4,'number');
            const updatedOtp = await Sellers.findOneAndUpdate({_id: sellerDetails._id},{otp:otp}, {new:true, upsert:true})
            if (_.isEmpty(updatedOtp)) {
                return this.res.send({ status: 0, message: "OTP details not updated" });
            }
            // Sending email
            await this.services.sendEmail(sellerDetails.emailId, "Salar", '',`<html><body><h2>HI! ${sellerDetails.fullName} </br> You have requested for a transaction password change otp for the</h2><strong>RegisteredId</strong>: ${sellerDetails.registerId} </br> <strong>OTP:</strong> ${otp}<h3></h3></body></html>`)
            const message = `Dear ${sellerDetails.fullName}, Welcome to www.salar.in Your Seller ID is ${sellerDetails.registerId}, Your otp is ${otp}, Regards Strawberri World Solutions Private Limited.";`
            // Sending message
            if(sellerDetails.countryId.name == 'India' && sellerDetails.mobileNo){
                await this.services.sendSignupConfirmation(sellerDetails.mobileNo, message)
            }
            return this.res.send({ status: 1, message: "OTP sent successfully"});
      
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Change Transaction Password
    Parameter:
    {
        "newTransactionPassword":"Test@123",
        "otp":"1231"
    }
    Return: JSON String
   ********************************************************/
    async changeTransactionPassword() {
        try {
            const seller = this.req.user;
            const data = this.req.body; 
            const fieldsArray = ["otp", "newTransactionPassword"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const sellerDetails = await Sellers.findOne({_id:seller},{ otp:1})
            if (_.isEmpty(sellerDetails)) {
                return this.res.send({ status: 0, message: "Seller not found" });
            }
            if(data.otp != sellerDetails.otp || data.otp ==""){
                return this.res.send({ status: 0, message: "Please enter valid OTP" });
            }
            const updatedSeller = await Sellers.findByIdAndUpdate(seller, { transactionPassword: data.newTransactionPassword, otp:""}, { new: true });
            return !updatedSeller ? this.res.send({ status: 0, message: "Transaction password not updated" }) : this.res.send({ status: 1, message: "Transaction password updated successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Get Seller Profile
    Method: Get
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getSellerProfile() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                const seller = await Sellers.findOne({ _id: currentSellerId, isDeleted: false, status: true, }, { password: 0, transactionPassword:0, _v: 0 }).populate('countryId',{ name: 1, iso: 1, nickname: 1 }).populate('mailingAddress.countryId',{ name: 1, iso: 1, nickname: 1 });
                if (_.isEmpty(seller)) {
                    return this.res.send({ status: 0, message: "Seller not found" });
                }
                return this.res.send({ status: 1, data: seller });
            }
            return this.res.send({ status: 0, message: "Seller not found" });

        } catch (error) {
            console.log('error is ', error)
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Edit Seller Profile
    Method: Post
    Authorisation: true
    Parameter:
    {
        "fullName": "Lakshmi Matta",
        "dob": "1996-09-29",
        "gender": "female",
        "age":26,
        "mobileNo": "7207334583",
        "emailId": "lakshmimattafreelancer@gmail.com",
        "mailingAddress":{
            "addressLine1":"addressLine1",
            "addressLine2":"addressLine2",
            "countryId":"630f516684310d4d2a98baf2",
            "city":"Rajahmundry",
            "state":"Andhra Pradesh",
            "pincode":533287,
        },
        "transactionPassword":""
    }
    Return: JSON String
    ********************************************************/
    async editSellerProfile() {
        try {
            const currentSellerId = this.req.user;
            const data = this.req.body;
            if (!data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send transaction password" });
            }
            if(data.mailingAddress.countryId){
                const validateCountry = await Country.findOne({_id: data.mailingAddress.countryId, status: 1});
                if (_.isEmpty(validateCountry)) {
                    return this.res.send({ status: 0, message: "Country details not found" })
                }
            }
            if(data.fullName){
                const validateName = await this.commonService.nameValidation(data.fullName);
                if(!validateName){
                    return this.res.send({ status: 0, message: "Please send proper fullName" });
                }
            }
            if(data.mobileNo){
                const validateMobileNo = await this.commonService.mobileNoValidation(data.mobileNo);
                if(!validateMobileNo){
                    return this.res.send({ status: 0, message: "Mobile number should have 10 digits" });
                }
                // check mobileNo is exist or not
                const sellerMobileNo = await Sellers.findOne({"mobileNo": data.mobileNo, "_id": { $ne: (currentSellerId)}});
                if(!_.isEmpty(sellerMobileNo)){
                    return this.res.send({ status: 0, message: "Mobile number already exists" });
                }
            }

            if(data.emailId){
                const validateEmail = await this.commonService.emailIdValidation(data.emailId);
                if(!validateEmail){
                    return this.res.send({ status: 0, message: "Please send proper emailId" });
                }
                // check emailId is exist or not
                const sellerEmail = await Sellers.findOne({"emailId": data.emailId, "_id": { $ne: (currentSellerId)}});
                if(!_.isEmpty(sellerEmail)){
                    return this.res.send({ status: 0, message: "emailId already exists" });
                }
            }
            const updatedSeller = await Sellers.findOneAndUpdate({_id:currentSellerId, transactionPassword: data.transactionPassword}, data, { new: true });
            if (_.isEmpty(updatedSeller)) {
                return this.res.send({ status: 0, message: "Seller details are not updated" })
            }
            return this.res.send({ status: 1, message: "Seller details updated successfully"});
        } catch (error) {
            console.log(`error: ${error}`)
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}
module.exports = SellerProfileController;