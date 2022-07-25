const _ = require("lodash");
const { ObjectID, ObjectId } = require('mongodb');

const Controller = require("../base");
const { IecDetails } = require('../../models/s_iec');
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
      Purpose: Add and update iec details
      Method: Post
      Authorisation: true
      Parameter:
      {
          "iecLicenseNo": "12345678901",
          "iecLicenseDoc": "licenseDoc.pdf"
          "iecId":""
      }               
      Return: JSON String
  ********************************************************/
    async addUpdateIecDetails() {
        try {
            const currentSellerId = this.req.user;
            let data = this.req.body;
            data.userId = currentSellerId;
            const fieldsArray = ["iecLicenseNo", "iecLicenseDoc"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const validateLicenseNo = await this.commonService.mobileNoValidation(data.iecLicenseNo);
            if (!validateLicenseNo) {
                return this.res.send({ status: 0, message: "Please send proper IEC License number" });
            }
            if (data.iecId) {
                await IecDetails.findByIdAndUpdate(data.iecId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Iec details updated successfully" });

            } else {
                const newIec = await new Model(IecDetails).store(data);
                if (_.isEmpty(newIec)) {
                    return this.res.send({ status: 0, message: "Iec details not saved" })
                }
                return this.res.send({ status: 1, message: "Iec details added successfully", data: { newIec } });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
   Purpose: Get Iec Details
   Method: Post
   {
       "iecId":""
   }
   Authorisation: true            
   Return: JSON String
   ********************************************************/
    async iecDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send iecId" });
            }
            const iec = await IecDetails.findOne({ _id: ObjectId(this.req.params.id), isDeleted: false }, { _v: 0 });
            if (_.isEmpty(iec)) {
                return this.res.send({ status: 0, message: "Iec details not found" });
            }
            return this.res.send({ status: 1, data: iec });
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
       "iecId":"5c9df24382ddca1298d855bb"
   }  
   Return: JSON String
   ********************************************************/
    async deleteIecDetails() {
        try {
            if (!this.req.params.id) {
                return this.res.send({ status: 0, message: "Please send iecId" });
            }
            await IecDetails.findByIdAndUpdate({ _id: ObjectId(this.req.params.id) }, { isDeleted: true }, { new: true, upsert: true })
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
    async iecDetailsOfSeller() {
        try {
            const currentSellerId = this.req.user;
            if (currentSellerId) {
                let iecDetails = await IecDetails.find({ userId: currentSellerId, isDeleted: false }, { __v: 0 });
                if (iecDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No iec details available" });
                }
                return this.res.send({ status: 1, message: "Details are: ", data: iecDetails });
            }
            return this.res.send({ status: 0, message: "Seller not found" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = IecDetailsController;