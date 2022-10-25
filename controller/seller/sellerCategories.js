const _ = require("lodash");

const Controller = require("../base");
const { Category } = require('../../models/s_category');
const { SubCategory } = require('../../models/s_sub_category');
const { ChildCategory } = require('../../models/s_child_category');
const { SellerCategories } = require('../../models/s_seller_categories');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads');

const lookupStages = [
    { $lookup: {from: "categories",localField: "categoryId",foreignField: "_id",as: "category"}},
    { $unwind: {"path": "$category","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "subcategories",localField: "subCategoryId",foreignField: "_id",as: "subCategory"}},
    { $unwind: {"path": "$subCategory","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "childcategories",localField: "childCategoryId",foreignField: "_id",as: "childCategory"}},
    { $unwind: {"path": "$childCategory","preserveNullAndEmptyArrays": true}},
 ]

const sellerCategoriesListingStages = [
    ...lookupStages,
     {$project: {
         _id:1, createdAt:1,registerId:1, categoryId:1, categoryName: "$category.name",
         subCategoryId:1, subCategoryName: "$subCategory.name", childCategoryId:1, childCategoryName: "$childCategory.name", image:1, status:1, approvalStatus:1}}
 ]

class SellerCategoriesController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

      /********************************************************
        Purpose: Add and update SellerCategories details
        Method: Post
        Authorisation: true
        Parameter:
        {
                "categoryId":"63170e9a48fa0416e046d087",
                "subCategoryId": "631e2f3799549f026bf52533", 
                "childCategoryId": "6317105f48fa0416e046d09d", 
                "image":"image.png"
                "sellerCategoryId": "" //optional 
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateSellerCategories() {
                try {
                    let data = this.req.body;
                    const fieldsArray = ["categoryId","subCategoryId" ,"childCategoryId" ,"image"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const category = await Category.findOne({_id: data.categoryId, status: 1},{_id:1})
                    if (_.isEmpty(category)) {
                        return this.res.send({ status: 0, message: "Category not found"});
                    }
                    const subCategory = await SubCategory.findOne({_id: data.subCategoryId, status: 1},{_id:1})
                    if (_.isEmpty(subCategory)) {
                        return this.res.send({ status: 0, message: "SubCategory not found"});
                    }
                    const childCategory = await ChildCategory.findOne({_id: data.childCategoryId, status: 1},{_id:1})
                    if (_.isEmpty(childCategory)) {
                        return this.res.send({ status: 0, message: "ChildCategory not found"});
                    }
                    if(data.sellerCategoryId){
                        await SellerCategories.findByIdAndUpdate(data.sellerCategoryId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "SellerCategories details updated successfully" });
                    }else{
                        let count = await SellerCategories.count();
                        if(count <= 8){
                            count = '0'+ (count+1);
                        }
                        const randomText = (await this.commonService.randomGenerator(2,'number') +await this.commonService.randomGenerator(1,'capital')+await this.commonService.randomGenerator(2,'number') )
                        data['registerId'] = 'SC'+randomText+ count
                        const newSellerCategories = await new Model(SellerCategories).store(data);
                        if (_.isEmpty(newSellerCategories)) {
                            return this.res.send({ status: 0, message: "SellerCategories details not saved" })
                        }
                        return this.res.send({ status: 1, message: "SellerCategories details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get SellerCategories Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getSellerCategories() {
        try {
            const data = this.req.params;
            if (!data.sellerCategoryId) {
                return this.res.send({ status: 0, message: "Please send sellerCategoryId" });
            }
            const sellerCategories = await SellerCategories.findOne({ _id: data.sellerCategoryId, isDeleted: false }, { _v: 0 }).populate('categoryId',{ name: 1, _id:1}).populate('subCategoryId',{ name: 1,_id:1}).populate('childCategoryId',{ name: 1, _id:1});
            if (_.isEmpty(sellerCategories)) {
                return this.res.send({ status: 0, message: "SellerCategories details not found" });
            }
            return this.res.send({ status: 1, data: sellerCategories });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple sellerCategories change status
     Parameter:
     {
        "sellerCategoryIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfSellerCategories() {
        try {
            let msg = "SellerCategories status not updated";
            const updatedSellerCategories = await SellerCategories.updateMany({ _id: { $in: this.req.body.sellerCategoryIds } }, { $set: { status: this.req.body.status } });
            if (updatedSellerCategories) {
                msg = updatedSellerCategories.modifiedCount ? updatedSellerCategories.modifiedCount + " seller categories updated" : updatedSellerCategories.matchedCount == 0 ? "SellerCategories not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Delete SellerCategories details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "sellerCategoryIds":["5c9df24382ddca1298d855bb"]
    }  
    Return: JSON String
    ********************************************************/
    async deleteSellerCategories() {
        try {
            if (!this.req.body.sellerCategoryIds) {
                return this.res.send({ status: 0, message: "Please send sellerCategoryIds" });
            }
            let msg = 'SellerCategories not deleted.';
            let status = 1;
            const updatedSellerCategories = await SellerCategories.updateMany({ _id: { $in: this.req.body.sellerCategoryIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedSellerCategories) {
                msg = updatedSellerCategories.modifiedCount ? updatedSellerCategories.modifiedCount + ' seller categories deleted.' : updatedSellerCategories.matchedCount== 0 ? "Details not found" : msg;
                status = updatedSellerCategories.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: sellerCategories Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-20",
        "endDate":"2022-09-25",
        "searchText": ""
    }
    Return: JSON String
    ********************************************************/
    async sellerCategoriesListing() {
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
                query.push({ $or: [{ categoryName: regex }, {subCategoryName: regex}, {childCategoryName: regex}, {approvalStatus: regex}] })
            }
            const result = await SellerCategories.aggregate([
                {$match: { isDeleted: false}},
                ...sellerCategoriesListingStages,
                {$match: { $and: query}},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await SellerCategories.aggregate([
                {$match: { isDeleted: false}},
                ...sellerCategoriesListingStages,
                {$match: { $and: query}},
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = SellerCategoriesController;