const _ = require("lodash");

const Controller = require("../base");
const { Deals } = require('../../models/s_deals');
const { Product } = require('../../models/s_product');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads');

const stages = [
    { $unwind: {"path": "$products","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "products",localField: "products.productId",foreignField: "_id",as: "product"}},
    { $unwind: {"path": "$product","preserveNullAndEmptyArrays": true}},
]
class DealsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

      /********************************************************
        Purpose: Add and update Deal details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "title": "For Products",
            "banner": "banner.jpg",
            "userLimit": 5,
            "pageLink":"www.google.com",
            "startDate": "2022/10/25",
            "endDate": "2023/10/25",
            "dealId": "" //optional 
        }               
        Return: JSON String
    ********************************************************/
    async addAndUpdateDeal() {
        try {
            let data = this.req.body;
            const fieldsArray = ["title","banner", "userLimit", "pageLink", "startDate", "endDate"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if(data.dealId){
                await Deals.findByIdAndUpdate(data.dealId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Deal details updated successfully" });
            }else{
                const newDeal = await new Model(Deals).store(data);
                if (_.isEmpty(newDeal)) {
                    return this.res.send({ status: 0, message: "Deal details not saved" })
                }
                return this.res.send({ status: 1, message: "Deal details added successfully"});
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
    Purpose: Add and update Product to deal  
    Method: POST
    {
        "productId":"6317160e1a75a7519664aadb",
        "discount": 100,
        "discountType": "Amount",
        "dealId":"634260a9bfca4f49c57438db",
        "product_id":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async addandUpdateProductToDeal() {
        try {
            const data = this.req.body;
            const fieldsArray = ["productId", "discount", "discountType", "dealId"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            let msg = "Products not added";
            if(data.product_id){
                await Deals.updateOne({ _id: data.dealId, "products._id": data.product_id }, {
                    $set: {
                        "products.$.productId": data.productId, "products.$.discountType": data.discountType, "products.$.discount": data.discount,
                    }
                })
                return this.res.send({ status: 1, message: "Product details updated successfully"});
            }else{
                const deal = await Deals.updateMany({ _id: { $in: data.dealId } }, { $push: { products: data } });
                if (deal) {
                    msg = deal.modifiedCount ? deal.modifiedCount + " deal updated" : deal.matchedCount == 0 ? "Deal not exists" : msg;
                }
                return this.res.send({ status: 1, message: msg }); 
            }
        }catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Delete ProductFromDeal
    Method: Post
    Authorisation: true
    Parameter:
    {
        "product_id":"5c9df24382ddca1298d855bb",
        "dealId":"634260a9bfca4f49c57438db"
    }  
    Return: JSON String
    ********************************************************/
    async deleteProductFromDeal() {
        try {
            const data = this.req.body
            await Deals.findByIdAndUpdate({ _id: data.dealId }, { $pull: { products: { _id: data.product_id } } })
            return this.res.send({ status: 1, message: "Product deleted successfully" });
        }catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Get Deal Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getDealDetails() {
        try {
            const data = this.req.params;
            if (!data.dealId) {
                return this.res.send({ status: 0, message: "Please send dealId" });
            }
            const Deal = await Deals.findOne({ _id: data.dealId, isDeleted: false }, { _v: 0 }).populate('products.productId', { name: 1, unit_price:1, commission:1, gst_amount:1, gst_percent:1, final_price:1 });
            if (_.isEmpty(Deal)) {
                return this.res.send({ status: 0, message: "Deal details not found" });
            }
            return this.res.send({ status: 1, data: Deal });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


     async getDealDetailsAll() {
        try {
            const Deal = await Deals.find({isDeleted: false }, { _v: 0 }).populate('products.productId', { name: 1, unit_price:1, commission:1, gst_amount:1, gst_percent:1, final_price:1 });
            if (_.isEmpty(Deal)) {
                return this.res.send({ status: 0, message: "Deal details not found" });
            }
            return this.res.send({ status: 1, data: Deal });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple deals change status
     Parameter:
     {
        "dealIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfDeals() {
        try {
            let msg = "Deal status not updated";
            const updatedDeals = await Deals.updateMany({ _id: { $in: this.req.body.dealIds } }, { $set: { status: this.req.body.status } });
            if (updatedDeals) {
                msg = updatedDeals.modifiedCount ? updatedDeals.modifiedCount + " deals updated" : updatedDeals.matchedCount == 0 ? "Deal not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Delete Deal details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "dealIds":["5c9df24382ddca1298d855bb"]
    }  
    Return: JSON String
    ********************************************************/
    async deleteDeals() {
        try {
            if (!this.req.body.dealIds) {
                return this.res.send({ status: 0, message: "Please send dealIds" });
            }
            let msg = 'Deal not deleted.';
            let status = 1;
            const updatedDeals = await Deals.updateMany({ _id: { $in: this.req.body.dealIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedDeals) {
                msg = updatedDeals.modifiedCount ? updatedDeals.modifiedCount + ' deals deleted.' : updatedDeals.matchedCount== 0 ? "Details not found" : msg;
                status = updatedDeals.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: deals Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-20",
        "endDate":"2022-10-25",
        "searchText": ""
    }
    Return: JSON String
    ********************************************************/
    async dealsListing() {
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
                const regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ title: regex }, { pageLink: regex }] })
            }
            const result = await Deals.aggregate([
                {$match: { isDeleted: false, $and: query}},
                {$project: {createdAt:1, title:1, pageLink:1, banner:1, usersLimit:1,
               products: {$size: "$products"}, startDate:1,endDate:1, status:1}},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Deals.aggregate([
                {$match: { isDeleted: false, $and: query}},
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
            "filteredFields": ["Date","Deal","Type of Discount" ,"Discount","Minimum Shopping Amount","Maximum Shopping Amount","Users Limit","Start Date","End Date","Status"] 
        }
       Return: JSON String
       ********************************************************/
       async downloadDealFiles() {
        try {
            let data =  this.req.body;
            if (!data.type) {
                return this.res.send({ status: 0, message: "Please send type of the file to download" });
            }
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
                console.log(`query: ${JSON.stringify(query)}`)
            }
            data.filteredFields = data.filteredFields ? data.filteredFields :
                ["Date","Title","Banner" ,"Users Limit","Products Count","Page Link","Start Date","End Date","Status"]
            if(data.searchText){
                const regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ dealsCode: regex }] })
            }
            data['model'] = Deals;
            data['stages'] = [];
            data['projectData'] = [{$project:{Date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata"} }, Title: "$title","Banner" :"$banner","Users Limit": "$usersLimit",
            "Products Count": {$size: "$products"}, "Page Link":"$pageLink", "Users Limit":"$userLimit",
              "Start Date":"$startDate", "End Date":"$endDate", Status: "$status"}}];
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['filterQuery'] = {}
            data['fileName'] = 'deals'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: products Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-20",
        "endDate":"2022-10-25",
        "searchText": ""
    }
    Return: JSON String
    ********************************************************/
    async productsListing() {
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
            let filter = [{}]
            if(data.searchText){
                const regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                filter.push({ $or: [{ "product.name": regex }, { "product.sku": regex }, { "product.description": regex }] })
            }
            const result = await Deals.aggregate([
                { $match: { isDeleted: false, $and: query}},
                ...stages,
                {$project: {createdAt:1, product:1, discountType: "$products.discountType", discount: "$products.discount"}},
                {$match: {$and: filter}},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Deals.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...stages,
                {$project: {createdAt:1, product:1, discountType: "$products.discountType", discount: "$products.discount"}},
                {$match: {$and: filter}},
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
            "filteredFields": ["SKU","Product Name","Discount Type" ,"Discount","Unit Price","Commission","GST Amount","GST Percent","Final Price"] 
        }
       Return: JSON String
       ********************************************************/
       async downloadProductsFiles() {
        try {
            let data =  this.req.body;
            if (!data.type) {
                return this.res.send({ status: 0, message: "Please send type of the file to download" });
            }
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
                console.log(`query: ${JSON.stringify(query)}`)
            }
            data.filteredFields = data.filteredFields ? data.filteredFields :
                ["SKU","Product Name","Product Description", "Discount Type" ,"Discount","Unit Price","Commission","GST Amount","GST Percent","Final Price"]
            let filter = [{}];
            if(data.searchText){
                const regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                filter.push({ $or: [{ "Product Name": regex }, { "SKU": regex },{ "Product Description": regex }, ] })
            }
            data['model'] = Deals;
            data['stages'] = stages;
            data['projectData'] = [{$project:{ "SKU":"$product.sku","Product Name": "$product.name", "Product Description": "$product.description","Unit Price":"$product.unit_price",
            Commission: "$product.commision", "GST Amount":"$product.gst_amount", "GST Percent":"$product.gst_percent", "Final Price":"$product.final_price", "Discount Type":"$products.discountType", "Discount":"$products.discount"}}];
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query}
            data['filterQuery'] = {$and: filter}
            data['fileName'] = 'deal-products'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = DealsController;