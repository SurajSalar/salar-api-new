const _ = require("lodash");

const Controller = require("../base");
const { TeamProducts } = require('../../models/s_team_products');
const { Product } = require('../../models/s_product');
const { TeamLevels } = require('../../models/s_team_levels');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const {ObjectID} = require('mongodb');
const DownloadsController = require('../common/downloads');



const populateTables = [
    { $lookup: {from: "products",localField: "productId",foreignField: "_id",as: "product"}},
    { $unwind: {"path": "$product","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "teamlevels",localField: "teamLevelId",foreignField: "_id",as: "teamlevel"}},
    { $unwind: {"path": "$teamlevel","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "categories",localField: "product.category",foreignField: "_id",as: "category"}},
    { $unwind: {"path": "$category","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "subcategories",localField: "product.sub_category",foreignField: "_id",as: "subCategory"}},
    { $unwind: {"path": "$subCategory","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "childcategories",localField: "product.child_category",foreignField: "_id",as: "childCategory"}},
    { $unwind: {"path": "$childCategory","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "sellers",localField: "product.seller",foreignField: "_id",as: "seller"}},
    { $unwind: {"path": "$seller","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "brands",localField: "product.brand",foreignField: "_id",as: "brand"}},
    { $unwind: {"path": "$brand","preserveNullAndEmptyArrays": true} },
]
const teamProductStages = [
    ...populateTables,
    {
        $project: {
            createdAt: 1,
            "category.name": "$category.name",
            "category._id": "$category._id",
            "sub_category.name": "$subCategory.name",
            "sub_category._id": "$subCategory._id",
            "child_category.name": "$childCategory.name",
            "child_category._id": "$childCategory._id",
            "seller.name": "$seller.name",
            "seller._id": "$seller._id",
            "brand.name": "$brand.name",
            "brand._id": "$brand._id",
            "product.unit_price": "$product.unit_price",
            "product.sku": "$product.sku",
            "product.name": "$product.name",
            "product.commision": "$product.commision",
            commission_amount: {
                $multiply: [{
                    $divide: ["$product.commision", 100]
                }, "$product.unit_price"]
            },
            "teamlevel.width": "$teamlevel.width",
            "teamlevel.depth": "$teamlevel.depth",
            "teamlevel.ULDownline": "$teamlevel.ULDownline",
            "teamlevel._id": "$subCategory._id",
            teamIncomePercentage: 1,
            teamIncomeAmount: {
                $multiply: [{
                    $divide: ["$teamIncomePercentage", 100]
                }, {
                    $multiply: [{
                        $divide: ["$product.commision", 100]
                    }, "$product.unit_price"]
                }]
            },
            ULDownlineShare: 1,
        }
    }, {
        $project: {
            createdAt: 1,
            category: 1,
            sub_category: 1,
            child_category: 1,
            seller: 1,
            brand: 1,
            product: 1,
            commission_amount: 1,
            teamlevel: 1,
            teamIncomePercentage: 1,
            teamIncomeAmount: 1,
            teamIncomeAmountOfUser: {
                $divide: ["$teamIncomeAmount", {
                    $multiply: ["$teamlevel.depth", "$teamlevel.ULDownline"]
                }]
            },
            leftAmount: {
                $subtract: ["$commission_amount", "$teamIncomeAmount"]
            },
            ULDownlineShare: 1,
            ULDownlineAmount: {
                $multiply: [{
                    $divide: [{
                        $subtract: ["$commission_amount", "$teamIncomeAmount"]
                    }, 100]
                }, "$ULDownlineShare"]
            },
        }
    }, {
        $project: {
            createdAt: 1,
            category: 1,
            sub_category: 1,
            child_category: 1,
            seller: 1,
            brand: 1,
            product: 1,
            commission_amount: 1,
            teamlevel: 1,
            teamIncomePercentage: 1,
            teamIncomeAmount: 1,
            teamIncomeAmountOfUser:1,
            leftAmount: 1,
            ULDownlineShare: 1,
            ULDownlineAmount: 1,
            ULDownlineAmountOfUser: {
                $divide: ["$ULDownlineAmount", {
                    $multiply: ["$teamlevel.width", "$teamlevel.ULDownline"]
                }]
            },
            remainingAmount: {
                $subtract: ["$leftAmount", "$ULDownlineAmount"]
            },
        }
    }]

const downloadFilesStages = [
    ...populateTables,
    {
        $project: {
            "Created Date": { $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} } ,
            Category: "$category.name",
            SubCategory: "$subCategory.name",
            ChildCategory: "$childCategory.name",
            Seller: "$seller.name",
            Brand: "$brand.name",
            Price: "$product.unit_price",
            "Product Id": "$product.sku",
            'Product Name': "$product.name",
            Commission: "$product.commision",
            'commissionAmount': {
                $multiply: [{
                    $divide: ["$product.commision", 100]
                }, "$product.unit_price"]
            },
            Plan: {
                $concat: [{$toString: "$teamlevel.width"}, " X ", {$toString: "$teamlevel.depth"}]
            },
            Width: "$teamlevel.width",
            Level: "$teamlevel.depth",
            ULDownline: "$teamlevel.ULDownline",
            'teamIncomePercentage': "$teamIncomePercentage",
            'teamIncomeAmount': {
                $multiply: [{
                    $divide: ["$teamIncomePercentage", 100]
                }, {
                    $multiply: [{
                        $divide: ["$product.commision", 100]
                    }, "$product.unit_price"]
                }]
            },
            ULDownlineShare: 1,
        }
    }, {
        $project: {
            "Created Date": 1,
            Category: 1,
            SubCategory: 1,
            ChildCategory: 1,
            Seller: 1,
            Brand: 1,
            Price: 1,
            "Product Id": 1,
            'Product Name': 1,
            Commission: 1,
            'Commission Amount': "$commissionAmount",
            Plan: 1,
            Width:1,
            Level: 1,
            ULDownline: 1,
            'Team Income Percentage': "$teamIncomePercentage",
            'Team Income Amount': "$teamIncomeAmount",
            'Team Income Amount Of User': {
                $divide: ["$teamIncomeAmount", {
                    $multiply: ["$Level", "$ULDownline"]
                }]
            },
            leftAmount: {
                $subtract: ["$commissionAmount", "$teamIncomeAmount"]
            },
            ULDownlineShare: 1,
            ULDownlineAmount: {
                $multiply: [{
                    $divide: [{
                        $subtract: ["$commissionAmount", "$teamIncomeAmount"]
                    }, 100]
                }, "$ULDownlineShare"]
            },
        }
    }, {
        $project: {
            "Created Date": 1,
            Category: 1,
            SubCategory: 1,
            ChildCategory: 1,
            Seller: 1,
            Brand: 1,
            Price: 1,
            "Product Id": 1,
            'Product Name': 1,
            Commission: 1,
            'Commission Amount': 1,
            Plan: 1,
            Level: 1,
            ULDownline: 1,
            'Team Income Percentage': 1,
            'Team Income Amount': 1,
            'Team Income Amount Of User':1,
            "Left Amount": "$leftAmount",
            ULDownlineShare: 1,
            ULDownlineAmount: 1,
            'ULDownline Amount Of User': {
                $divide: ["$ULDownlineAmount", {
                    $multiply: ["$Width", "$ULDownline"]
                }]
            },
            "Remaining Amount": {
                $subtract: ["$leftAmount", "$ULDownlineAmount"]
            },
        }
    }]

class TeamProductsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
    /********************************************************
   Purpose: Create and Update Team Products
   Method: Post
   Authorisation: true
   Parameter:
      {
          "productId": "6317160e1a75a7519664aadb",
          "teamLevelId": "63247f1e83a0f9ddafdf981a",
          "teamIncomePercentage": 3
          "ULDownlineShare":1,
          "teamProductId":" " // optional
      }
   Return: JSON String
   ********************************************************/
   async addAndUpdateTeamProduct() {
    try {
        let data = this.req.body;
        const fieldsArray = ["productId","teamLevelId","teamIncomePercentage","ULDownlineShare"]
        const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
        if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
            return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
        }
        const teamLevel = await TeamLevels.findOne({ _id: data.teamLevelId, isDeleted:false }, { __v: 0 });
        if (_.isEmpty(teamLevel)){
            return this.res.send({ status: 0, message: "Team Level not found" });
        }
        const product = await Product.findOne({ _id: data.productId, isDeleted:false }, { __v: 0 });
        if (_.isEmpty(product)){
            return this.res.send({ status: 0, message: "Product details not found" });
        }
        if(data.teamProductId){
            const teamProduct = await TeamProducts.findOne({ _id: data.teamProductId, isDeleted:false }, { __v: 0 });
            if (_.isEmpty(teamProduct)){
                return this.res.send({ status: 0, message: "Team Product not found" });
            }
            const updatedTeamProduct = await TeamProducts.findOneAndUpdate({_id: data.teamProductId}, data, {upsert: true, new: true})
            if (_.isEmpty(updatedTeamProduct)) {
                return this.res.send({ status: 0, message: "Details are not updated" });
            }
            return this.res.send({ status: 1, message: "Team Product details updated successfully", data: updatedTeamProduct });
        }else{
            const newTeamProduct = await new Model(TeamProducts).store(data);
            if (_.isEmpty(newTeamProduct)) {
                return this.res.send({ status: 0, message: "Details not saved" });
            }
            return this.res.send({ status: 1, message: "Team Product details created successfully", data: newTeamProduct });
        }
    } catch (error) {
        console.log("error- ", error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
}

/********************************************************
    Purpose: Get Team Products Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getTeamProductDetails() {
        try {
            const teamProductId = this.req.params.teamProductId;
            if (!teamProductId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const teamProduct = await TeamProducts.aggregate([
                {$match: {_id: ObjectID(teamProductId), isDeleted: false}},
                ...teamProductStages
            ])
            if (_.isEmpty(teamProduct))
                return this.res.send({ status: 0, message: "Team Product not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: teamProduct });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Team Products Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"16-09-2022",
        "endDate":"16-09-2022"
    }
    Return: JSON String
    ********************************************************/
    async teamProductsListing() {
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
            const result = await TeamProducts.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...teamProductStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await TeamProducts.count({isDeleted:false})
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    
    /********************************************************
       Purpose: Delete Single And Multiple Team Products Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "teamProductIds":["5cd01da1371dc7190b085f86"]
       }
       Return: JSON String
       ********************************************************/
       async deleteTeamProducts() {
        try {
            if (!this.req.body.teamProductIds) {
                return this.res.send({ status: 0, message: "Please send teamProductIds" });
            }
            let msg = 'Team Product not deleted.';
            let status = 1;
            const updatedTeamProducts = await TeamProducts.updateMany({ _id: { $in: this.req.body.teamProductIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedTeamProducts) {
                msg = updatedTeamProducts.modifiedCount ? updatedTeamProducts.modifiedCount + ' team level deleted.' : updatedTeamProducts.matchedCount== 0 ? "Details not found" : msg;
                status = updatedTeamProducts.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
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
            "startDate":"2022-09-16",
            "endDate":"2022-09-16"
            "filteredFields": ["Category"] }
       Return: JSON String
       ********************************************************/
       async downloadTeamProductFiles() {
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
                ["Created Date", "Category", "SubCategory", "ChildCategory", "Seller", "Brand", "Price", "Product Id", "Product Name", "Commission", "Commission Amount", "Plan", "Level", "ULDownline", "Team Income Percentage", "Team Income Amount", "Team Income Amount Of User", "Left Amount", "ULDownlineShare", "ULDownlineAmount", "ULDownline Amount Of User", "Remaining Amount"]

            data['model'] = TeamProducts;
            data['stages'] = downloadFilesStages;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['fileName'] = 'team_products'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = TeamProductsController;