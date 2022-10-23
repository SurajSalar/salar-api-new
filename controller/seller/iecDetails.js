const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { IecDetails } = require('../../models/s_iec');
const { Sellers } = require('../../models/s_sellers');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class IecDetailsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


      /********************************************************
        Purpose: Add and update Iec details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "iecLicenseNo": "12345678901",
            "iecLicenseDoc": "aadhar.png",
            "transactionPassword":"",
            "iecId":"",
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateIecDetails() {
                try {
                    const currentSellerId = this.req.user;
                    let data = this.req.body;
                    data.sellerId = currentSellerId;
                    const fieldsArray = ["iecLicenseNo", "iecLicenseDoc", "transactionPassword"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const seller = await Sellers.findOne({_id: currentSellerId, transactionPassword: data.transactionPassword},{_id:1})
                    if (_.isEmpty(seller)) {
                        return this.res.send({ status: 0, message: "Seller not found"});
                    }
                    if(data.iecId){
                        await IecDetails.findByIdAndUpdate(data.iecId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Iec details updated successfully" });
                    }else{
                        const getIec = await IecDetails.findOne({sellerId: currentSellerId, isDeleted: false})
                        if (!_.isEmpty(getIec)) {
                            return this.res.send({ status: 0, message: "Iec details exists" })
                        }
                        const newIec = await new Model(IecDetails).store(data);
                        if (_.isEmpty(newIec)) {
                            return this.res.send({ status: 0, message: "Iec details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Iec details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Iec Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getIecDetails() {
        try {
            const data = this.req.params;
            if (!data.iecId) {
                return this.res.send({ status: 0, message: "Please send iecId" });
            }
            const Iec = await IecDetails.findOne({ sellerId: this.req.user, _id: data.iecId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(Iec)) {
                return this.res.send({ status: 0, message: "Iec details not found" });
            }
            return this.res.send({ status: 1, data: Iec });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Delete Iec details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "iecId":"5c9df24382ddca1298d855bb",
        "transactionPassword":""
    }  
    Return: JSON String
    ********************************************************/
    async deleteIecDetails() {
        try {
            const data = this.req.body;
            if (!data.iecId || !data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send iecId and transactionPassword" });
            }
            const seller = await Sellers.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Seller not found"});
            }
            await IecDetails.findByIdAndUpdate({ _id: ObjectID(data.iecId) },{isDeleted: true}, {new:true, upsert:true})
            return this.res.send({ status: 1, message: "Iec details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Iec Details Of Seller
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getIecDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let iecDetails = await IecDetails.find({ sellerId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (iecDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No Iec details available"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: iecDetails });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = IecDetailsController;