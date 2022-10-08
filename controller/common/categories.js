const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { Category } = require('../../models/s_category');
const { SubCategory } = require('../../models/s_sub_category');
const { ChildCategory } = require('../../models/s_child_category');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class CategoriesController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  /********************************************************
    Purpose: Get categories List 
    Method: POST
    {
        "searchText":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getCategoriesList() {
        try {
            const data = this.req.body;
            const query = [{}];
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ name: regex }, {description: regex}] })
            }
            const categories = await Category.aggregate([
                {$match: {$and: query}},
                {$project: {_id:1, name:1}},
                {$sort: {_id:-1}},
                {$limit:20}
            ])
           return this.res.send({ status: 1, message: "Details are: ", data: categories });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Get subCategories List 
    Method: POST
    {
        "searchText":"", // optional
        "categoryId":"" 
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getSubCategoriesList() {
        try {
            const data = this.req.body;
            if(!data.categoryId){
                return this.res.send({ status: 0, message: "Please send categoryId" });
            }
            const query = [{}];
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ name: regex }, {description: regex}] })
            }
            const subCategories = await SubCategory.aggregate([
                {$match: {$and: query, category: ObjectID(data.categoryId)}},
                {$project: {_id:1, name:1}},
                {$sort: {_id:-1}},
                {$limit:20}
            ])
            return this.res.send({ status: 1, message: "Details are: ", data: subCategories });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Get childCategories List 
    Method: POST
    {
        "searchText":"" // optional
        "subCategoryId":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getChildCategoriesList() {
        try {
            const data = this.req.body;
            if(!data.subCategoryId){
                return this.res.send({ status: 0, message: "Please send subCategoryId" });
            }
            const query = [{}];
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ name: regex }, {description: regex}] })
            }
            const childCategories = await ChildCategory.aggregate([
                {$match: {$and: query, subcategory: {$in: [ObjectID(data.subCategoryId)]}}},
                {$project: {_id:1, name:1}},
                {$sort: {_id:-1}},
                {$limit:20}
            ])
            return this.res.send({ status: 1, message: "Details are: ", data: childCategories });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}
module.exports = CategoriesController;