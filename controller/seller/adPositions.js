const _ = require("lodash");

const Controller = require("../base");
const { AdPositions } = require('../../models/s_ad_positions');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");

const categoriesStages = [
    { $lookup: {from: "categories",localField: "categoryId",foreignField: "_id",as: "category"}},
    { $unwind: {"path": "$category","preserveNullAndEmptyArrays": true}},
 ]

const adPositionsListingStages = [
    ...categoriesStages,
     {$project: {
         _id:1,position: 1, categoryName: "$category.name"
         }}
 ]

class AdPositionsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

    
    /********************************************************
    Purpose: Get adPositions List 
    Method: POST
    {
        "searchText":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getAdPositionsList() {
        try {
            const data = this.req.body;
            let query = [{}];
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ position: regex }, {categoryName: regex}] })
            }
            const adPositions = await AdPositions.aggregate([
                {$match: { isDeleted: false}},
                ...adPositionsListingStages,
                {$match: { $and: query}},
                {$sort: {_id:-1}},
                {$limit: 20},
            ]);
            return this.res.send({ status: 1, message: "Details are: ", data: adPositions });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
      
}
module.exports = AdPositionsController;