const _ = require("lodash");
const { ObjectID, ObjectId } = require('mongodb');

const Controller = require("../base");
const { EtdDetails } = require('../../models/s_etd');
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
      Purpose: Add and update etd details
      Method: Post
      Authorisation: true
      Parameter:
      {
          "name": "Salar ETD",
          "panNo": "12345678901",
          "panImage": "pan.png",
          "gstNo": "09HDGEU5647F4ZD",
          "gstImage": "gst.png",
          "etdId":""
      }               
      Return: JSON String
  ********************************************************/
    async addUpdateEtdDetails() {
        try {
            const currentSellerId = this.req.user;
            let data = this.req.body;
            data.userId = currentSellerId;
            const fieldsArray = ["name", "gstNo", "gstImage", "panImage", "panNo"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const validatePan = await this.commonService.panCardValidation(data.panNo);
            if (!validatePan) {
                return this.res.send({ status: 0, message: "Please send proper PAN number" });
            }

            const validateGST = await this.commonService.GSTValidation(data.gstNo);
            if (!validateGST) {
                return this.res.send({ status: 0, message: "Please send proper GST number" });
            }

            if (data.etdId) {
                await EtdDetails.findByIdAndUpdate(data.etdId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Etd details updated successfully" });
            } else {
                const newEtd = await new Model(EtdDetails).store(data);
                if (_.isEmpty(newEtd)) {
                    return this.res.send({ status: 0, message: "Etd details not saved" })
                }
                return this.res.send({ status: 1, message: "Etd details added successfully", data: { newEtd } });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
   Purpose: Get Etd Details
   Method: Get
   {
       "etdId":""
   }
   Authorisation: true            
   Return: JSON String
   ********************************************************/
    async etdDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send etdId" });
            }
            const etd = await EtdDetails.findOne({ _id: ObjectId(this.req.params.id), isDeleted: false }, { _v: 0 });
            if (_.isEmpty(etd)) {
                return this.res.send({ status: 0, message: "Etd details not found" });
            }
            return this.res.send({ status: 1, data: { etd } });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
   Purpose: Delete Etd details
   Method: Delete
   Authorisation: true
   Parameter:
   {
       "etdId":"5c9df24382ddca1298d855bb"
   }  
   Return: JSON String
   ********************************************************/
    async deleteEtdDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send etdId" });
            }
            await EtdDetails.findByIdAndUpdate({ _id: ObjectId(this.req.params.id) }, { isDeleted: true }, { new: true, upsert: true })
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
    async etdDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let etdDetails = await EtdDetails.find({ userId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (etdDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No etd details available" });
                }
                return this.res.send({ status: 1, message: "Details are: ", data: etdDetails });
            }
            return this.res.send({ status: 0, message: "Seller not found" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = EtdDetailsController;