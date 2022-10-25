const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { AdPositions } = require('../../models/s_ad_positions');
const { Category } = require('../../models/s_category');
const { Sellers } = require('../../models/s_sellers');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads');


const categoriesStages = [
    { $lookup: {from: "categories",localField: "categoryId",foreignField: "_id",as: "category"}},
    { $unwind: {"path": "$category","preserveNullAndEmptyArrays": true}},
 ]

const adPositionsListingStages = [
    ...categoriesStages,
     {$project: {
         _id:1, createdAt:1, category:1, position:1, sliders:1, status:1, updatedAt:1
         }}
 ]

 const downloadFilesStagesProjection = [
     {$project: {
        "Created Date":{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata"} },
        "Category": "$category.name",
        "Position Name": "$position",
        "No. Sliders": { $size: "$sliders" },
        "Updated Date":{ $dateToString: { format: "%Y-%m-%d", date: "$updatedAt", timezone: "Asia/Kolkata"} },
        "Status": "$status"
         }}
 ]

class AdPositionsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

      /********************************************************
        Purpose: Add and update AdPosition details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "position": "User",
            "categoryId": "63170e9a48fa0416e046d087",
            "sliders": [{"image":"banner.png"}],
            "adPositionId":"" //optional
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateAdPosition() {
                try {
                    let data = this.req.body;
                    const fieldsArray = ["position","categoryId", "sliders"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const category = await Category.findOne({_id: data.categoryId, status: 1},{_id:1})
                    if (_.isEmpty(category)) {
                        return this.res.send({ status: 0, message: "Category not found"});
                    }
                    if(data.adPositionId){
                        await AdPositions.findByIdAndUpdate(data.adPositionId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "AdPosition details updated successfully" });
                    }else{
                        const getAdPosition = await AdPositions.findOne({categoryId: data.categoryId, isDeleted: false})
                        if (!_.isEmpty(getAdPosition)) {
                            return this.res.send({ status: 0, message: "AdPosition details already exists" })
                        }
                       
                        const newAdPosition = await new Model(AdPositions).store(data);
                        if (_.isEmpty(newAdPosition)) {
                            return this.res.send({ status: 0, message: "AdPosition details not saved" })
                        }
                        return this.res.send({ status: 1, message: "AdPosition details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get AdPosition Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getAdPosition() {
        try {
            const data = this.req.params;
            if (!data.adPositionId) {
                return this.res.send({ status: 0, message: "Please send adPositionId" });
            }
            const AdPosition = await AdPositions.findOne({ _id: data.adPositionId, isDeleted: false }, { _v: 0 }).populate('categoryId',{ name: 1, _id:1});
            if (_.isEmpty(AdPosition)) {
                return this.res.send({ status: 0, message: "AdPosition details not found" });
            }
            return this.res.send({ status: 1, data: AdPosition });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple adPositions change status
     Parameter:
     {
        "adPositionIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfAdPositions() {
        try {
            let msg = "AdPosition status not updated";
            const updatedAdPositions = await AdPositions.updateMany({ _id: { $in: this.req.body.adPositionIds } }, { $set: { status: this.req.body.status } });
            console.log("updatedAdPositions",updatedAdPositions)
            if (updatedAdPositions) {
                msg = updatedAdPositions.modifiedCount ? updatedAdPositions.modifiedCount + " adPosition updated" : updatedAdPositions.matchedCount == 0 ? "AdPosition not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Delete AdPosition details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "adPositionIds":["5c9df24382ddca1298d855bb"]
    }  
    Return: JSON String
    ********************************************************/
    async deleteAdPositions() {
        try {
            if (!this.req.body.adPositionIds) {
                return this.res.send({ status: 0, message: "Please send adPositionIds" });
            }
            let msg = 'AdPosition not deleted.';
            let status = 1;
            const updatedAdPositions = await AdPositions.updateMany({ _id: { $in: this.req.body.adPositionIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedAdPositions) {
                msg = updatedAdPositions.modifiedCount ? updatedAdPositions.modifiedCount + ' adPosition deleted.' : updatedAdPositions.matchedCount== 0 ? "Details not found" : msg;
                status = updatedAdPositions.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: adPositions Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-20",
        "endDate":"2022-09-25",
        "searchText": "",
    }
    Return: JSON String
    ********************************************************/
    async adPositionsListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
                console.log(`query: ${JSON.stringify(query)}`)
            }
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ position: regex }, {"category.name": regex}] })
            }
            const result = await AdPositions.aggregate([
                {$match: { isDeleted: false}},
                ...adPositionsListingStages,
                {$match: { $and: query}},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await AdPositions.aggregate([
                {$match: { isDeleted: false}},
                ...adPositionsListingStages,
                {$match: { $and: query}},
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
       Purpose: Download csv and excel files
       Method: Post
       Authorisation: true
       Parameter:
       {
            "type":"csv" or "excel",
            "startDate":"2022-09-20",
            "endDate":"2022-09-25",
            "searchText": "",
            "filteredFields": ["Created Date","Category","Position Name","No. Sliders","Updated Date","Status"]
        }
       Return: JSON String
       ********************************************************/
       async downloadAdPositionsFiles() {
        try {
            let data =  this.req.body;
            if (!data.type) {
                return this.res.send({ status: 0, message: "Please send type of the file to download" });
            }
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
            }
            data.filteredFields = data.filteredFields ? data.filteredFields :
                ["Created Date","Category","Position Name","No. Sliders","Updated Date","Status"]
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ position: regex }, {"category.name": regex}] })
            }
            data['model'] = AdPositions;
            data['stages'] = categoriesStages;
            data['projectData'] = downloadFilesStagesProjection;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false};
            data['filterQuery'] =  { $and: query};
            data['fileName'] = 'ad-postions'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = AdPositionsController;