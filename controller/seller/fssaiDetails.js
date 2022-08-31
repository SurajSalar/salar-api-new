const _ = require("lodash");
const { ObjectID, ObjectId } = require('mongodb');
const Controller = require("../base");
const { FssaiDetails } = require('../../models/s_fssai');
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
      Purpose: Add and update fssai details
      Method: Post
      Authorisation: true
      Parameter:
      {
           licenseNo: "75668475847586",
           qrCode: "qrImage.png",
           licenseDoc: "license.png",
          "fssaiId":""
      }               
      Return: JSON String
  ********************************************************/
    async addUpdateFssaiDetails() {
        try {
            const currentSellerId = this.req.user;
            let data = this.req.body;
            data.userId = currentSellerId;
            const fieldsArray = ["licenseNo", "qrCode", "licenseDoc"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const validateFssai = await this.commonService.fssaiLicenseNoValidation(data.licenseNo);
            if (!validateFssai) {
                return this.res.send({ status: 0, message: "Please send proper FSSAI License number" });
            }
            if (data.fssaiId) {
                await FssaiDetails.findByIdAndUpdate(data.fssaiId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Fssai details updated successfully" });
            } else {
                const newFssai = await new Model(FssaiDetails).store(data);
                if (_.isEmpty(newFssai)) {
                    return this.res.send({ status: 0, message: "Fssai details not saved" })
                }
                return this.res.send({ status: 1, message: "Fssai details added successfully", data: { newFssai } });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
   Purpose: Get Fssai Details
   Method: Get
   {
       "fssaiId":""
   }
   Authorisation: true            
   Return: JSON String
   ********************************************************/
    async fssaiDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send fssaiId" });
            }
            const fssai = await FssaiDetails.findOne({ _id: ObjectId(this.req.params.id), isDeleted: false }, { _v: 0 });
            if (_.isEmpty(fssai)) {
                return this.res.send({ status: 0, message: "Fssai details not found" });
            }
            return this.res.send({ status: 1, data: { fssai } });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
   Purpose: Delete Fssai details
   Method: Delete
   Authorisation: true
   Parameter:
   {
       "fssaiId":"5c9df24382ddca1298d855bb"
   }  
   Return: JSON String
   ********************************************************/
    async deleteFssaiDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send fssaiId" });
            }
            await FssaiDetails.findByIdAndUpdate({ _id: ObjectId(this.req.params.id) }, { isDeleted: true }, { new: true, upsert: true })
            return this.res.send({ status: 1, message: "fssai details deleted successfully" });
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
    async fssaiDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let fssaiDetails = await FssaiDetails.find({ userId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (fssaiDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No fssai details available" });
                }
                return this.res.send({ status: 1, message: "Details are: ", data: fssaiDetails });
            }
            return this.res.send({ status: 0, message: "Seller not found" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = FssaiDetailsController;