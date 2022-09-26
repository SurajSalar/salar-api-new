const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { KycDetails } = require('../../models/s_kyc');
const { Users } = require('../../models/s_users');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class KycDetailsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


      /********************************************************
        Purpose: Add and update kyc details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "selectId": "Aadhar Card",
            "numberProof": "12345678901",
            "frontImage": "aadhar.png",
            "backImage": "aadhar.png",
            "kycId":"",
            "transactionPassword":""
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateKycDetails() {
                try {
                    const currentUserId = this.req.user;
                    let data = this.req.body;
                    data.userId = currentUserId;
                    const fieldsArray = ["selectId", "numberProof","frontImage","backImage", "transactionPassword"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const user = await Users.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
                    if (_.isEmpty(user)) {
                        return this.res.send({ status: 0, message: "User not found"});
                    }
                    if(data.selectId == 'Driving License'){
                        const validateDL = await this.commonService.drivingLicenseValidation(data.numberProof);
                        if(!validateDL){
                            return this.res.send({ status: 0, message: "Please send proper driving license number" });
                        }
                    }
                    if(data.selectId == 'Aadhar Card'){
                        const validateAadharCard = await this.commonService.aadharCardValidation(data.numberProof);
                        if(!validateAadharCard){
                            return this.res.send({ status: 0, message: "Please send proper aadhar card number" });
                        }
                    }
                    if(data.selectId == 'Passport'){
                        const validatePassport = await this.commonService.passportValidation(data.numberProof);
                        if(!validatePassport){
                            return this.res.send({ status: 0, message: "Please send proper passport number" });
                        }
                    }
                    if(data.selectId == 'Voter ID'){
                        const validateVoterId = await this.commonService.voterIdValidation(data.numberProof);
                        if(!validateVoterId){
                            return this.res.send({ status: 0, message: "Please send proper voter id number" });
                        }
                    }
                    if(data.selectId == 'SSN'){
                        const validateSSN = await this.commonService.SSNValidation(data.numberProof);
                        if(!validateSSN){
                            return this.res.send({ status: 0, message: "Please send proper SSN number" });
                        }
                    }
                    if(data.kycId){
                        await KycDetails.findByIdAndUpdate(data.kycId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Kyc details updated successfully" });

                    }else{
                        const getKyc = await KycDetails.findOne({userId: currentUserId, isDeleted: false})
                        if (!_.isEmpty(getKyc)) {
                            return this.res.send({ status: 0, message: "Kyc details exists" })
                        }
                        const newKyc = await new Model(KycDetails).store(data);
                        if (_.isEmpty(newKyc)) {
                            return this.res.send({ status: 0, message: "Kyc details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Kyc details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Kyc Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getKycDetails() {
        try {
            const data = this.req.params;
            if (!data.kycId) {
                return this.res.send({ status: 0, message: "Please send kycId" });
            }
            const kyc = await KycDetails.findOne({ _id: data.kycId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(kyc)) {
                return this.res.send({ status: 0, message: "Kyc details not found" });
            }
            return this.res.send({ status: 1, data: kyc });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Delete Kyc details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "kycId":"5c9df24382ddca1298d855bb",
        "transactionPassword":""
    }  
    Return: JSON String
    ********************************************************/
    async deleteKycDetails() {
        try {
            const data = this.req.body;
            if (!data.kycId || !data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send kycId and transactionPassword" });
            }
            const user = await Users.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User not found"});
            }
            await KycDetails.findByIdAndUpdate({ _id: ObjectID(data.kycId) },{isDeleted: true}, {new:true, upsert:true})
            return this.res.send({ status: 1, message: "Kyc details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Kyc Details Of User
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getKycDetailsOfUser() {
        try {
            const currentUserId = this.req.user;
            if (currentUserId) {
                let kycDetails = await KycDetails.find({ userId: currentUserId, isDeleted: false }, { __v: 0 });
                if (kycDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No kyc details available"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: kycDetails });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = KycDetailsController;