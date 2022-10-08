const _ = require("lodash");

const Controller = require("../base");
const { Advertisements } = require('../../models/advertisements');
const { AdPositions } = require('../../models/s_ad_positions');
const { Stores } = require('../../models/s_store');
const { Sellers } = require('../../models/s_sellers');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");

const lookupStages = [
    { $lookup: {from: "sellers",localField: "sellerId",foreignField: "_id",as: "seller"}},
    { $unwind: {"path": "$seller","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "stores",localField: "storeId",foreignField: "_id",as: "store"}},
    { $unwind: {"path": "$store","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "ad_positions",localField: "positionId",foreignField: "_id",as: "adPosition"}},
    { $unwind: {"path": "$adPosition","preserveNullAndEmptyArrays": true}},
 ]

const advertisementListingStages = [
    ...lookupStages,
     {$project: {
         _id:1, createdAt:1, registerId:1, title:1, file:1, categoryPage: 1, productPage:1, position:1,
         sliderNo:1, seller:1, store:1, pageLink:1, startDate:1, endDate:1, status:1, updatedAt:1, approvalStatus:1, reason:1,
         }}
 ]

class AdvertisementsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


  /********************************************************
    Purpose: advertisement Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3
    }
    Return: JSON String
    ********************************************************/
    async advertisementListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            const result = await Advertisements.aggregate([
                {$match: { isDeleted: false}},
                ...advertisementListingStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Advertisements.aggregate([
                {$match: { isDeleted: false}},
                ...advertisementListingStages,
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
        Purpose: Update advertisement details by admin
        Method: Post
        Authorisation: true
        Parameter:
        {
            "approvalStatus": "Rejected",
            "reason": "Reason for rejection"
            "advertisementId":"",
        }               
        Return: JSON String
    ********************************************************/
        async updateAdvertisementStatusByAdmin() {
            try {
                const data = this.req.body;
                const fieldsArray = data.approvalStatus == "Rejected"? ["approvalStatus", "reason", "advertisementId"] : ["approvalStatus", "advertisementId"];
                const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                }
                const advertisement = await Advertisements.findOne({_id: data.advertisementId, isDeleted: false});
                if (_.isEmpty(advertisement))
                    return this.res.send({ status: 0, message: "Advertisement details not found" });
                await Advertisements.findByIdAndUpdate(data.advertisementId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Advertisement details updated successfully" });
            }
            catch (error) {
                console.log("error- ", error);
                this.res.send({ status: 0, message: error });
            }
        }
}
module.exports = AdvertisementsController;