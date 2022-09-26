const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { Users } = require('../../models/s_users');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");



class UserProfileController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

     /********************************************************
    Purpose: Change Password
    Parameter:
        {
            "oldPassword":"password",
            "newPassword":"newpassword"
        }
    Return: JSON String
   ********************************************************/
    async changePassword() {
        try {
            const user = this.req.user;
            const userDetails = await Users.findOne({_id:user},{password:1})
            if (_.isEmpty(userDetails)) {
                return this.res.send({ status: 0, message: "User not found" });
            }
            const passwordObj = {
                oldPassword: this.req.body.oldPassword,
                newPassword: this.req.body.newPassword,
                savedPassword: userDetails.password
            };
            const password = await this.commonService.changePasswordValidation({ passwordObj });
            if (typeof password.status !== 'undefined' && password.status == 0) {
                return this.res.send(password);
            }

            const updatedUser = await Users.findByIdAndUpdate(user._id, { password: password}, { new: true });
            return !updatedUser ? this.res.send({ status: 0, message: "Password not updated" }) : this.res.send({ status: 1, message: "Password updated successfully" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Change Transaction Password
    Parameter:
        {
            "oldTransactionPassword":"transactonPassword",
            "newTransactionPassword":"newTransactionpassword"
        }
    Return: JSON String
   ********************************************************/
    async changeTransactionPassword() {
        try {
            const user = this.req.user;
            const userDetails = await Users.findOne({_id:user},{transactionPassword:1})
            if (_.isEmpty(userDetails)) {
                return this.res.send({ status: 0, message: "User not found" });
            }
            const passwordObj = {
                oldTransactionPassword: this.req.body.oldTransactionPassword,
                newTransactionPassword: this.req.body.newTransactionPassword,
                savedTransactionPassword: userDetails.transactionPassword
            };
            const transactionPassword = await this.commonService.changeTransactionPasswordValidation({ passwordObj });
            if (typeof transactionPassword.status !== 'undefined' && transactionPassword.status == 0) {
                return this.res.send(transactionPassword);
            }

            const updatedUser = await Users.findByIdAndUpdate(user._id, { transactionPassword: transactionPassword}, { new: true });
            return !updatedUser ? this.res.send({ status: 0, message: "Transaction password not updated" }) : this.res.send({ status: 1, message: "Transaction password updated successfully" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

      /********************************************************
    Purpose: Get User Profile
    Method: Get
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getUserProfile() {
        try {
            const currentUserId = this.req.user;
            if (currentUserId) {
                const user = await Users.findOne({ _id: currentUserId, isDeleted: false, status: true, }, { password: 0, transactionPassword:0, _v: 0 });
                if (_.isEmpty(user)) {
                    return this.res.send({ status: 0, message: "User not found" });
                }
                return this.res.send({ status: 1, data: user });
            }
            return this.res.send({ status: 0, message: "User not found" });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Edit User Profile
    Method: Post
    Authorisation: true
    Parameter:
    {
        "fullName":"Ramakurty Lakshmi",
        "dob":"29-09-1996",
        "gender":"female",
        "age":"25",
        "emailId":"lakshmimattafreelancer@gmail.com",
        "countryId":"630f516684310d4d2a98baf2",
        "mobileNo":"7207334583"
    }               
    Return: JSON String
    ********************************************************/
    async editUserProfile() {
        try {
            const currentUserId = this.req.user;
            const data = this.req.body;
            delete data.emailId
            if(data.fullName){
                const validateName = await this.commonService.nameValidation(data.fullName);
                if(!validateName){
                    return this.res.send({ status: 0, message: "Please send proper fullName" });
                }
            }
            if(data.countryId){
                const validateCountry = await Country.findOne({_id: data.countryId, status: 1});
                if (_.isEmpty(validateCountry)) {
                    return this.res.send({ status: 0, message: "Country details not found" })
                }
            }
            if(data.mobileNo){
                const validateMobileNo = await this.commonService.mobileNoValidation(data.mobileNo);
                if(!validateMobileNo){
                    return this.res.send({ status: 0, message: "Mobile number should have 10 digits" });
                }
                // check emailId is exist or not
                const userMobileNoCount = await Users.count({"mobileNo": data.mobileNo, "_id": { $nin: [(currentUserId)]}});
                if(userMobileNoCount >=10){
                    return this.res.send({ status: 0, message: "This mobile number exceeds the limit of registeration, please use other mobile for registration" });
                }
            }
            
            await Users.findByIdAndUpdate(currentUserId, data, { new: true });
            return this.res.send({ status: 1, message: "User details updated successfully"});
        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Add ShippingAddress
    Method: Post
    Authorisation: true
    Parameter:
    {
        "name":"lakshmi",
        "addressLine1":"near govt hospital",
        "addressLine2":"seethanagaram",
        "city":"rajahmundry",
        "zipCode":"533287",
        "mobileNo":"7207334583",
        "emailId":"lakshmimattafreelancer@gmail.com",
        "country":"India",
        "GST":"ewsfwe",
    }         
    Return: JSON String
    ********************************************************/
    async addShippingAddress() {
        try {
            const currentUserId = this.req.user;
            let data = this.req.body
            const fieldsArray = ["name", "addressLine1","addressLine2","city","GST","country","zipCode","mobileNo","emailId"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const validateEmail = await this.commonService.emailIdValidation(data.emailId);
            if(!validateEmail){
                return this.res.send({ status: 0, message: "Please send proper emailId" });
            }
            const validateMobileNo = await this.commonService.mobileNoValidation(data.mobileNo);
            if(!validateMobileNo){
                return this.res.send({ status: 0, message: "Mobile number should have 10 digits" });
            }

            const validateGST = await this.commonService.GSTValidation(data.GST);
            if(!validateGST){
                return this.res.send({ status: 0, message: "Please send proper GST number" });
            }

            const validateZipCode = await this.commonService.zipCodeValidation(data.zipCode, data.country);
            if(!validateZipCode){
                return this.res.send({ status: 0, message: "Zip code should have 6 digits" });
            }

            data.zipCode = parseInt(data.zipCode); 
            if (currentUserId) {
                await Users.findByIdAndUpdate(currentUserId, { $push: { "shippingAddresses": data } });

                return this.res.send({ status: 1, message: "Address added successfully" });
            }
        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Update ShippingAddress
    Method: Post
    Authorisation: true
    Parameter:
    {
        "name":"lakshmi",
        "addressLine1":"near govt hospital",
        "addressLine2":"seethanagaram",
        "city":"rajahmundry",
        "zipCode":"533287",
        "mobileNo":"7207334583",
        "emailId":"lakshmimattafreelancer@gmail.com",
        "country":"India",
        "GST":"ewsfwe",
        "addressId":"5c9df23b82ddca1298d855ba"
    }      
    Return: JSON String
    ********************************************************/
    async updateShippingAddress() {
        try {
            const currentUserId = this.req.user;
            let data = this.req.body
            const fieldsArray = ["addressId","name", "addressLine1","addressLine2","city","GST","country","zipCode","mobileNo","emailId"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const validateEmail = await this.commonService.emailIdValidation(data.emailId);
            if(!validateEmail){
                return this.res.send({ status: 0, message: "Please send proper emailId" });
            }
            const validateMobileNo = await this.commonService.mobileNoValidation(data.mobileNo);
            if(!validateMobileNo){
                return this.res.send({ status: 0, message: "Mobile number should have 10 digits" });
            }

            const validateGST = await this.commonService.GSTValidation(data.GST);
            if(!validateGST){
                return this.res.send({ status: 0, message: "Please send proper GST number" });
            }

            const validateZipCode = await this.commonService.zipCodeValidation(data.zipCode, data.country);
            if(!validateZipCode){
                return this.res.send({ status: 0, message: "Zip code should have 6 digits" });
            }

            data.zipCode = parseInt(data.zipCode); 

            if (currentUserId) {
                await Users.updateOne({ _id: ObjectID(currentUserId), "shippingAddresses._id": ObjectID(data.addressId) }, {
                    $set: {
                        "shippingAddresses.$.addressLine1": data.addressLine1, "shippingAddresses.$.addressLine2": data.addressLine2, "shippingAddresses.$.name": data.name, "shippingAddresses.$.city": data.city, "shippingAddresses.$.GST": data.GST, "shippingAddresses.$.zipCode": parseInt(data.zipCode), "shippingAddresses.$.mobileNo": data.mobileNo, "shippingAddresses.$.emailId": data.emailId, "shippingAddresses.$.country": data.country
                    }
                })
                return this.res.send({ status: 1, message: "Address updated successfully" });
            }
        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Delete ShippingAddress
    Method: Post
    Authorisation: true
    Parameter:
    {
        "addressId":"5c9df24382ddca1298d855bb"
    }  
    Return: JSON String
    ********************************************************/
    async deleteShippingAddress() {
        try {
            const currentUserId = this.req.user;
            const data = this.req.body;
            if (!data.addressId) {
                return this.res.send({ status: 0, message: "Please send addressId" });
            }
            if (currentUserId) {
                await Users.findByIdAndUpdate({ _id: ObjectID(currentUserId) }, { $pull: { shippingAddresses: { _id: ObjectID(data.addressId) } } })
                return this.res.send({ status: 1, message: "Address deleted successfully" });
            }
        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: User Manage Addresses
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async userManageAddress() {
        try {
            const currentUserId = this.req.user;
            if (currentUserId) {
                let user = await Users.findOne({ _id: currentUserId, isDeleted: false, status: true }, { shippingAddresses: 1 });
                if (_.isEmpty(user)) {
                    return this.res.send({ status: 0, message: "User not found"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: user.shippingAddresses });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
  
    /********************************************************
    Purpose: Set Default Address
    Method: Post
    Authorisation: true
    Parameter:
    {
        "addressId":"5cc971d1cb171c143f7d6c6f"
    }
    Return: JSON String
    ********************************************************/
    async setDefaultAddress() {
        try {
            const currentUserId = this.req.user;
            const data = this.req.body;
            if (!data.addressId) {
                return this.res.send({ status: 0, message: "Please send addressId" });
            }
            if (currentUserId) {
                await Users.updateMany({ _id: ObjectID(currentUserId), "shippingAddresses": { $elemMatch: { defaultAddress: true } } }, { $set: { "shippingAddresses.$.defaultAddress": false } })
                await Users.updateOne({ _id: ObjectID(currentUserId), "shippingAddresses": { $elemMatch: { _id: ObjectID(this.req.body.addressId) } } }, { $set: { "shippingAddresses.$.defaultAddress": true } })
                return this.res.send({ status: 1, message: "Details updated successfully" });
            }
        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get ShippingAddress
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getShippingAddress() {
        try {
            const currentUserId = this.req.user;
            if (currentUserId) {
                const userDetails = await Users.find({ _id: ObjectID(currentUserId), "shippingAddresses": { $elemMatch: { defaultAddress: true } } }, { "shippingAddresses.$": 1 })
                if (_.isEmpty(userDetails)) {
                    return this.res.send({ status: 0, message: "Address details not found"});
                }
                return this.res.send({ status: 1, data: userDetails[0].shippingAddresses[0] });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log(error)
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }



}
module.exports = UserProfileController;