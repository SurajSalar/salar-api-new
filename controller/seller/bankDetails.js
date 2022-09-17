const _ = require("lodash");
const { ObjectID, ObjectId } = require('mongodb');

const Controller = require("../base");
const { BankDetails } = require('../../models/s_bank_details');
const { Sellers } = require('../../models/s_sellers');
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
        "fullName": "salarUser",
        "bankName": "ICICI",
        "accountNumber": "95867948594938",
        "IFSCCode": "ICIC0005943",
        "accountType":"savings",
        "branchName":"Delhi",
        "bankStatement":"bankStatement.jpg",
        "IBANNumber": "AL902081100800000010395318016475839485",
        "swiftCode": "BKDNINBBDDR",
        "panCard": "UDHRO5761H",
        "bankId": ""
      }          
      Return: JSON String
  ********************************************************/
    async addUpdateBankDetails() {
        try {
            const currentSellerId = this.req.user;
            const seller = await Sellers.findOne({ _id: currentSellerId }, { country: 1 })
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Seller not found" });
            }
            let data = this.req.body;
            data.userId = currentSellerId;
            const fieldsArray = seller.country == 'India' ?
                ["fullName", "bankName",  "branchName", "accountNumber", "accountType", "IFSCCode", "panCard"] :
                ["fullName", "bankName",  "branchName", "accountNumber", "accountType", "IBANNumber", "swiftCode"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if (!['savings', 'current'].includes(data.accountType)) { return this.res.send({ status: 0, message: "Account Type should be either savings or current" }); }
            if (data.IBANNumber) {
                const validateIBAN = await this.commonService.IBANNumberValidation(data.IBANNumber);
                if (!validateIBAN) {
                    return this.res.send({ status: 0, message: "Please send proper IBAN number" });
                }
            }
            if (data.swiftCode) {
                const validateSwiftCode = await this.commonService.swiftCodeValidation(data.swiftCode);
                if (!validateSwiftCode) {
                    return this.res.send({ status: 0, message: "Please send proper swift code" });
                }
            }
            if (data.IFSCCode) {
                const validateIFSCCode = await this.commonService.IFSCCodeValidation(data.IFSCCode);
                if (!validateIFSCCode) {
                    return this.res.send({ status: 0, message: "Please send proper IFSC Code" });
                }
            }
            if (data.pancard) {
                const validatePanCard = await this.commonService.panCardValidation(data.pancard);
                if (!validatePanCard) {
                    return this.res.send({ status: 0, message: "Please send proper pan card number" });
                }
            }
            if (data.id) {
                await BankDetails.findByIdAndUpdate(data.id, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Bank details updated successfully" });

            } else {
                const newBank = await new Model(BankDetails).store(data);
                if (_.isEmpty(newBank)) {
                    return this.res.send({ status: 0, message: "Bank details not saved" })
                }
                return this.res.send({ status: 1, message: "Bank details added successfully", data: { newBank } });
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
            const data = this.req.params;
            if (!data.id) {
                return this.res.send({ status: 0, message: "Please send bankId" });
            }
            const bank = await BankDetails.findOne({ _id: data.id, isDeleted: false }, { _v: 0 });
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
     "bankId":"5c9df24382ddca1298d855bb"
 }  
 Return: JSON String
 ********************************************************/
    async deleteBankDetails() {
        try {
            const data = this.req.params;
            if (!data.id) {
                return this.res.send({ status: 0, message: "Please send bankId" });
            }
            await BankDetails.findByIdAndUpdate({ _id: ObjectId(data.id) }, { isDeleted: true }, { new: true, upsert: true })
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
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let bankDetails = await BankDetails.find({ userId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (bankDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No bank details available" });
                }
                return this.res.send({ status: 1, message: "Details are: ", data: bankDetails });
            }
            return this.res.send({ status: 0, message: "Seller not found" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}
module.exports = BankDetailsController;