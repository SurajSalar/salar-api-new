const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { EtdDetails } = require('../../models/s_etd');
const { Sellers } = require('../../models/s_sellers');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class EtdDetailsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


      /********************************************************
        Purpose: Add and update Etd details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "name": "12345678901",
            "gstNo": "aadhar.png",
            "gstImage":"",
            "panImage":"",
            "panNo":"",
            "transactionPassword":"",
            "etdId":"",
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateEtdDetails() {
                try {
                    const currentSellerId = this.req.user;
                    let data = this.req.body;
                    data.sellerId = currentSellerId;
                    const fieldsArray = ["name", "gstNo", "gstImage", "panImage", "panNo","transactionPassword"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const seller = await Sellers.findOne({_id: currentSellerId, transactionPassword: data.transactionPassword},{_id:1})
                    if (_.isEmpty(seller)) {
                        return this.res.send({ status: 0, message: "Seller not found"});
                    }
                    if(data.etdId){
                        await EtdDetails.findByIdAndUpdate(data.etdId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Etd details updated successfully" });
                    }else{
                        const getEtd = await EtdDetails.findOne({sellerId: currentSellerId, isDeleted: false})
                        console.log(`getEtd: ${getEtd}, currentSellerId: ${currentSellerId}`)
                        if (!_.isEmpty(getEtd)) {
                            return this.res.send({ status: 0, message: "Etd details exists" })
                        }
                        const newEtd = await new Model(EtdDetails).store(data);
                        if (_.isEmpty(newEtd)) {
                            return this.res.send({ status: 0, message: "Etd details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Etd details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Etd Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getEtdDetails() {
        try {
            const data = this.req.params;
            if (!data.etdId) {
                return this.res.send({ status: 0, message: "Please send etdId" });
            }
            const Etd = await EtdDetails.findOne({ sellerId: this.req.user, _id: data.etdId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(Etd)) {
                return this.res.send({ status: 0, message: "Etd details not found" });
            }
            return this.res.send({ status: 1, data: Etd });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Delete Etd details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "etdId":"5c9df24382ddca1298d855bb",
        "transactionPassword":""
    }  
    Return: JSON String
    ********************************************************/
    async deleteEtdDetails() {
        try {
            const data = this.req.body;
            if (!data.etdId || !data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send etdId and transactionPassword" });
            }
            const seller = await Sellers.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
            if (_.isEmpty(seller)) {
                return this.res.send({ status: 0, message: "Seller not found"});
            }
            await EtdDetails.findByIdAndUpdate({ _id: ObjectID(data.etdId) },{isDeleted: true}, {new:true, upsert:true})
            return this.res.send({ status: 1, message: "Etd details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Etd Details Of Seller
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getEtdDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let etdDetails = await EtdDetails.find({ sellerId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (etdDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No Etd details available"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: etdDetails });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = EtdDetailsController;