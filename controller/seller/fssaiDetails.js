const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { FssaiDetails } = require('../../models/s_fssai');
const { Sellers } = require('../../models/s_sellers');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class FssaiDetailsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


      /********************************************************
        Purpose: Add and update Fssai details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "licenseNo": "12345678901",
            "qrCode": "aadhar.png",
            "licenseDoc":"",
            "transactionPassword":"",
            "fssaiId":"",
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateFssaiDetails() {
                try {
                    const currentSellerId = this.req.user;
                    let data = this.req.body;
                    data.sellerId = currentSellerId;
                    const fieldsArray = ["licenseNo", "qrCode", "licenseDoc", "transactionPassword"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const seller = await Sellers.findOne({_id: currentSellerId, transactionPassword: data.transactionPassword},{_id:1})
                    if (_.isEmpty(seller)) {
                        return this.res.send({ status: 0, message: "Seller not found"});
                    }
                    if(data.fssaiId){
                        await FssaiDetails.findByIdAndUpdate(data.fssaiId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Fssai details updated successfully" });
                    }else{
                        const getFssai = await FssaiDetails.findOne({sellerId: currentSellerId, isDeleted: false})
                        if (!_.isEmpty(getFssai)) {
                            return this.res.send({ status: 0, message: "Fssai details exists" })
                        }
                        const newFssai = await new Model(FssaiDetails).store(data);
                        if (_.isEmpty(newFssai)) {
                            return this.res.send({ status: 0, message: "Fssai details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Fssai details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Fssai Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getFssaiDetails() {
        try {
            const data = this.req.params;
            if (!data.fssaiId) {
                return this.res.send({ status: 0, message: "Please send fssaiId" });
            }
            const Fssai = await FssaiDetails.findOne({ sellerId: this.req.user, _id: data.fssaiId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(Fssai)) {
                return this.res.send({ status: 0, message: "Fssai details not found" });
            }
            return this.res.send({ status: 1, data: Fssai });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Delete Fssai details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "fssaiId":"5c9df24382ddca1298d855bb",
        "transactionPassword":""
    }  
    Return: JSON String
    ********************************************************/
    async deleteFssaiDetails() {
        try {
            const data = this.req.body;
            if (!data.fssaiId || !data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send fssaiId and transactionPassword" });
            }
            const seller = await Sellers.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Seller not found"});
            }
            await FssaiDetails.findByIdAndUpdate({ _id: ObjectID(data.fssaiId) },{isDeleted: true}, {new:true, upsert:true})
            return this.res.send({ status: 1, message: "Fssai details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Fssai Details Of Seller
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getFssaiDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let fssaiDetails = await FssaiDetails.find({ sellerId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (fssaiDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No Fssai details available"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: fssaiDetails });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = FssaiDetailsController;