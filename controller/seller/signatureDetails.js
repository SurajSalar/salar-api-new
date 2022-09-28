const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { SignatureDetails } = require('../../models/s_signature');
const { Sellers } = require('../../models/s_sellers');
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
            "uploadSignature": "12345678901",
            "drawSignature": "aadhar.png",
            "transactionPassword":"",
            "signatureId":"",
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateSignatureDetails() {
                try {
                    const currentSellerId = this.req.user;
                    let data = this.req.body;
                    data.sellerId = currentSellerId;
                    const fieldsArray = ["uploadSignature", "drawSignature", "transactionPassword"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const seller = await Sellers.findOne({_id: currentSellerId, transactionPassword: data.transactionPassword},{_id:1})
                    if (_.isEmpty(seller)) {
                        return this.res.send({ status: 0, message: "Seller not found"});
                    }
                    if(data.signatureId){
                        await SignatureDetails.findByIdAndUpdate(data.signatureId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Signature details updated successfully" });
                    }else{
                        const getSignature = await SignatureDetails.findOne({sellerId: currentSellerId, isDeleted: false})
                        if (!_.isEmpty(getSignature)) {
                            return this.res.send({ status: 0, message: "Signature details exists" })
                        }
                        const newSignature = await new Model(SignatureDetails).store(data);
                        if (_.isEmpty(newSignature)) {
                            return this.res.send({ status: 0, message: "Signature details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Signature details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Signature Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getSignatureDetails() {
        try {
            const data = this.req.params;
            if (!data.signatureId) {
                return this.res.send({ status: 0, message: "Please send signatureId" });
            }
            const Signature = await SignatureDetails.findOne({ sellerId: this.req.user, _id: data.signatureId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(Signature)) {
                return this.res.send({ status: 0, message: "Signature details not found" });
            }
            return this.res.send({ status: 1, data: Signature });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Delete Signature details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "signatureId":"5c9df24382ddca1298d855bb",
        "transactionPassword":""
    }  
    Return: JSON String
    ********************************************************/
    async deleteSignatureDetails() {
        try {
            const data = this.req.body;
            if (!data.signatureId || !data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send signatureId and transactionPassword" });
            }
            const seller = await Sellers.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Seller not found"});
            }
            await SignatureDetails.findByIdAndUpdate({ _id: ObjectID(data.signatureId) },{isDeleted: true}, {new:true, upsert:true})
            return this.res.send({ status: 1, message: "Signature details deleted successfully" });
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
    async getSignatureDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let signatureDetails = await SignatureDetails.find({ sellerId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (signatureDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No Signature details available"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: signatureDetails });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = SignatureDetailsController;