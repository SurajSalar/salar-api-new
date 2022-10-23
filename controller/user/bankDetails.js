const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { BankDetails } = require('../../models/s_bank_details');
const { Users } = require('../../models/s_users');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class BankDetailsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


      /********************************************************
        Purpose: Add and update bank details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "fullName": "Lakshmi",
            "bankName": "SBI",
            "accountNumber": "1039531801",
            "IBANNumber": "AL90208110080000001039531801",
            "IFSCCode": "SBIN0005943",
            "swiftCode": "BKDNINBBDDR",
            "panCard": "ALWPG5809L",
            "nomineeName": "test",
            "nomineeRelation": "test",
            "nomineeMobileNo": "1234567890",
            "nomineeEmailId": "test@gmail.com",
            "bankId":"",
            "transactionPassword":""
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateBankDetails() {
            try {
                const currentUserId = this.req.user;
                let data = this.req.body;
                data.userId = currentUserId;
                if(!data.transactionPassword){
                    return this.res.send({ status: 0, message: "Please send transactionPassword"});
                }
                const user = await Users.findOne({_id: currentUserId, transactionPassword: data.transactionPassword},{countryId:1}).populate('countryId',{ name: 1, iso: 1, nickname: 1 })
                if (_.isEmpty(user)) {
                    return this.res.send({ status: 0, message: "User not found"});
                }
                const fields = user.countryId.name == 'India'? ["IFSCCode","panCard"] : ["IBANNumber","swiftCode",]
                const fieldsArray = user.role == 'regular'? ["fullName","bankName","accountNumber","nomineeName","nomineeRelation","nomineeMobileNo","nomineeEmailId", ...fields]: 
                    ["fullName","bankName","accountNumber", ...fields];
                const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                }
               
                if(data.IBANNumber){
                    const validateIBAN = await this.commonService.IBANNumberValidation(data.IBANNumber);
                    if(!validateIBAN){
                        return this.res.send({ status: 0, message: "Please send proper IBAN number" });
                    }
                }
                if(data.swiftCode){
                    const validateSwiftCode = await this.commonService.swiftCodeValidation(data.swiftCode);
                    if(!validateSwiftCode){
                        return this.res.send({ status: 0, message: "Please send proper swift code" });
                    }
                }
                if(data.IFSCCode){
                    const validateIFSCCode = await this.commonService.IFSCCodeValidation(data.IFSCCode);
                    if(!validateIFSCCode){
                        return this.res.send({ status: 0, message: "Please send proper IFSC Code" });
                    }
                }
                if(data.pancard){
                    const validatePanCard = await this.commonService.panCardValidation(data.pancard);
                    if(!validatePanCard){
                        return this.res.send({ status: 0, message: "Please send proper pan card number" });
                    }
                }
                if(data.bankId){
                    await BankDetails.findByIdAndUpdate(data.bankId, data, { new: true, upsert: true });
                    return this.res.send({ status: 1, message: "Bank details updated successfully" });

                }else{
                    const newBank = await new Model(BankDetails).store(data);
                    if (_.isEmpty(newBank)) {
                        return this.res.send({ status: 0, message: "Bank details not saved" })
                    }
                    return this.res.send({ status: 1, message: "Bank details added successfully"});
                }
            }
            catch (error) {
                console.log("error- ", error);
                this.res.send({ status: 0, message: error });
            }
        }

     /********************************************************
    Purpose: Get Bank Details
    Method: Post
    {
        "bankId":""
    }
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getBankDetails() {
        try {
            const data = this.req.body;
            if (!data.bankId) {
                return this.res.send({ status: 0, message: "Please send bankId" });
            }
            const bank = await BankDetails.findOne({ _id: data.bankId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(bank)) {
                return this.res.send({ status: 0, message: "Bank details not found" });
            }
            return this.res.send({ status: 1, data: bank });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

       /********************************************************
    Purpose: Delete Bank details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "bankId":"5c9df24382ddca1298d855bb",
        "transactionPassword": ""
    }  
    Return: JSON String
    ********************************************************/
    async deleteBankDetails() {
        try {
            const data = this.req.body;
            if (!data.bankId || !data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send bankId and transactionPassword" });
            }
            const user = await Users.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User not found"});
            }
            await BankDetails.findByIdAndUpdate({ _id: ObjectID(data.bankId) },{isDeleted: true}, {new:true, upsert:true})
            return this.res.send({ status: 1, message: "Bank details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    /********************************************************
    Purpose: Get Bank Details Of User
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getBankDetailsOfUser() {
        try {
            const currentUserId = this.req.user;
            if (currentUserId) {
                let bankDetails = await BankDetails.find({ userId: currentUserId, isDeleted: false }, { __v: 0 });
                if (bankDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No bank details available"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: bankDetails });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}
module.exports = BankDetailsController;