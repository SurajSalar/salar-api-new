const _ = require("lodash");
const { ObjectID, ObjectId } = require('mongodb');

const Controller = require("../base");
const { KycDetails } = require('../../models/s_kyc');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");

const idProofs = {
    AADHAR_CARD: 'Aadhar Card',
    DRIVING_LICENCE: 'Driving License',
    PASSPORT: 'Passport',
    VOTER_ID: 'Voter ID',
    SSN: 'SSN'
}

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
          "imageProof": "aadhar.png",
          "kycId":""
      }               
      Return: JSON String
  ********************************************************/
    async addUpdateKycDetails() {
        try {
            const currentSellerId = this.req.user;
            let data = this.req.body;
            data.userId = currentSellerId;
            const fieldsArray = ["selectId", "numberProof", "imageProof"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if (data.selectId == idProofs.DRIVING_LICENCE) {
                const validateDL = await this.commonService.drivingLicenseValidation(data.numberProof);
                if (!validateDL) {
                    return this.res.send({ status: 0, message: "Please send proper driving license number" });
                }
            }
            if (data.selectId == idProofs.AADHAR_CARD) {
                const validateAadharCard = await this.commonService.aadharCardValidation(data.numberProof);
                if (!validateAadharCard) {
                    return this.res.send({ status: 0, message: "Please send proper aadhar card number" });
                }
            }
            if (data.selectId == idProofs.PASSPORT) {
                const validatePassport = await this.commonService.passportValidation(data.numberProof);
                if (!validatePassport) {
                    return this.res.send({ status: 0, message: "Please send proper passport number" });
                }
            }
            if (data.selectId == idProofs.VOTER_ID) {
                const validateVoterId = await this.commonService.voterIdValidation(data.numberProof);
                if (!validateVoterId) {
                    return this.res.send({ status: 0, message: "Please send proper voter id number" });
                }
            }
            if (data.selectId == idProofs.SSN) {
                const validateSSN = await this.commonService.SSNValidation(data.numberProof);
                if (!validateSSN) {
                    return this.res.send({ status: 0, message: "Please send proper SSN number" });
                }
            }
            if (data.kycId) {
                await KycDetails.findByIdAndUpdate(data.kycId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Kyc details updated successfully" });

            } else {
                const newKyc = await new Model(KycDetails).store(data);
                if (_.isEmpty(newKyc)) {
                    return this.res.send({ status: 0, message: "Kyc details not saved" })
                }
                return this.res.send({ status: 1, message: "Kyc details added successfully", data: { newKyc } });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
   Purpose: Get Kyc Details
   Method: Post
   {
       "kycId":""
   }
   Authorisation: true            
   Return: JSON String
   ********************************************************/
    async kycDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send kycId" });
            }
            const kyc = await KycDetails.findOne({ _id: ObjectId(this.req.params.id), isDeleted: false }, { _v: 0 });
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
       "kycId":"5c9df24382ddca1298d855bb"
   }  
   Return: JSON String
   ********************************************************/
    async deleteKycDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send kycId" });
            }
            await KycDetails.findByIdAndUpdate({ _id: ObjectId(this.req.params.id) }, { isDeleted: true }, { new: true, upsert: true })
            return this.res.send({ status: 1, message: "Kyc details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Kyc Details Of Seller
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async kycDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let kycDetails = await KycDetails.find({ userId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (kycDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No kyc details available" });
                }
                return this.res.send({ status: 1, message: "Details are: ", data: kycDetails });
            }
            return this.res.send({ status: 0, message: "Seller not found" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = KycDetailsController;