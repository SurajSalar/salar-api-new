const _ = require("lodash");
const { ObjectID, ObjectId } = require('mongodb');
const Controller = require("../base");
const { SignatureDetails } = require('../../models/s_signature');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");

class SignatureDetailsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

    /********************************************************
      Purpose: Add and update Signature details
      Method: Post
      Authorisation: true
      Parameter:
      {
           uploadSignature: "signature.png",
           drawSignature: "draw-signature.png",
           transactionPassword: "Test@123",
          "signatureId":""
      }               
      Return: JSON String
  ********************************************************/
    async addUpdateSignatureDetails() {
        try {
            const currentSellerId = this.req.user;
            let data = this.req.body;
            data.userId = currentSellerId;
            const fieldsArray = ["uploadSignature", "drawSignature", "transactionPassword"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if (data.signatureId) {
                await SignatureDetails.findByIdAndUpdate(data.signatureId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Signature details updated successfully" });
            } else {
                const encryptedPassword = await this.commonService.ecryptPassword({ password: data['transactionPassword'] });
                data.transactionPassword = encryptedPassword
                const newSignature = await new Model(SignatureDetails).store(data);
                if (_.isEmpty(newSignature)) {
                    return this.res.send({ status: 0, message: "Signature details not saved" })
                }
                return this.res.send({ status: 1, message: "Signature details added successfully", data: { newSignature } });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
   Purpose: Get Signature Details
   Method: Get
   {
       "signatureId":""
   }
   Authorisation: true            
   Return: JSON String
   ********************************************************/
    async signatureDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send signatureId" });
            }
            const signature = await SignatureDetails.findOne({ _id: ObjectId(this.req.params.id), isDeleted: false }, { _v: 0 });
            if (_.isEmpty(signature)) {
                return this.res.send({ status: 0, message: "Signature details not found" });
            }
            return this.res.send({ status: 1, data: { signature } });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
   Purpose: Delete Signature details
   Method: Delete
   Authorisation: true
   Parameter:
   {
       "signatureId":"5c9df24382ddca1298d855bb"
   }  
   Return: JSON String
   ********************************************************/
    async deleteSignatureDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send signatureId" });
            }
            await SignatureDetails.findByIdAndUpdate({ _id: ObjectId(this.req.params.id) }, { isDeleted: true }, { new: true, upsert: true })
            return this.res.send({ status: 1, message: "signature details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Signature Details Of Seller
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async signatureDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let signatureDetails = await SignatureDetails.find({ userId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (signatureDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No signature details available" });
                }
                return this.res.send({ status: 1, message: "Details are: ", data: signatureDetails });
            }
            return this.res.send({ status: 0, message: "Seller not found" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = SignatureDetailsController;