const _ = require("lodash");

const Controller = require("../base");
const { Users } = require('../../models/s_users');
const { Sellers } = require('../../models/s_sellers');
const { Order } = require('../../models/s_orders');
const { Admin } = require('../../models/s_admin');
const { WalletManagements } = require('../../models/s_wallet_management');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const { ObjectID } = require('mongodb');

const kycSellerStages = [
    {
        "$lookup" : {
            "from" : "kycs",
            "let" : {
                "sellerId" : "$_id"
            },
            "pipeline" : [
                {
                    "$match" : {
                        "$expr" : {
                            "$and" : [
                                {
                                    "$eq" : [
                                        "$isDeleted",
                                        false
                                    ]
                                },
                                {
                                    "$eq" : [
                                        "$sellerId",
                                        "$$sellerId"
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            "as" : "kycDetails"
        }
    }, 
    { $unwind: {"path": "$kycDetails","preserveNullAndEmptyArrays": true} },
]

const kycUserStages = [
    {
        "$lookup" : {
            "from" : "kycs",
            "let" : {
                "userId" : "$_id"
            },
            "pipeline" : [
                {
                    "$match" : {
                        "$expr" : {
                            "$and" : [
                                {
                                    "$eq" : [
                                        "$isDeleted",
                                        false
                                    ]
                                },
                                {
                                    "$eq" : [
                                        "$userId",
                                        "$$userId"
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            "as" : "kycDetails"
        }
    }, 
    { $unwind: {"path": "$kycDetails","preserveNullAndEmptyArrays": true} },
]

const walletAmountListingStages = [
    { $lookup: {from: "users",localField: "userId",foreignField: "_id",as: "user"}},
    { $unwind: {"path": "$user","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "sellers",localField: "sellerId",foreignField: "_id",as: "seller"}},
    { $unwind: {"path": "$seller","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "admins",localField: "adminId",foreignField: "_id",as: "admin"}},
    { $unwind: {"path": "$admin","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "orders",localField: "orderId",foreignField: "_id",as: "order"}},
    { $unwind: {"path": "$order","preserveNullAndEmptyArrays": true}},
]
class WalletManagementController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


    /********************************************************
    Purpose: Get users List 
    Method: POST
    {
        "searchText":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getUsersList() {
        try {
            const data = this.req.body;
            const query = [{}];
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ fullName: regex }, {registerId: regex}, {mobileNo: regex}, {emailId: regex}, {"kycDetails.selectId": regex}, {"kycDetails.numberProof": regex}] })
            }
            const users = await Users.aggregate([
                ...kycUserStages,
                {$match: {$and: query}},
                {$project: {_id:1, fullName:1, registerId:1}},
                {$sort: {_id:-1}},
                {$limit:20}
            ])
            return this.res.send({ status: 1, message: "Details are: ", data: users });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get sellers List 
    Method: POST
    {
        "searchText":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getSellersList() {
        try {
            const data = this.req.body;
            const query = [{}];
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ fullName: regex }, {registerId: regex}, {mobileNo: regex}, {emailId: regex}, {"kycDetails.selectId": regex}, {"kycDetails.numberProof": regex}] })
            }
            const sellers = await Sellers.aggregate([
                ...kycSellerStages,
                {$match: {$and: query}},
                {$project: {_id:1, fullName:1, registerId:1}},
                {$sort: {_id:-1}},
                {$limit:20}
            ])
            return this.res.send({ status: 1, message: "Details are: ", data: sellers });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get orders List 
    Method: POST
    {
        "searchText":"",
        "userId":"",
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getOrdersList() {
        try {
            const data = this.req.body;
            let query = [{}];
            const filter = data.userId ? {user_id: ObjectID(data.userId)} : {}
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ "user.fullName": regex }, {"user.registerId": regex}, {"user.mobileNo": regex}, {"user.emailId": regex}] })
            }
            const orders = await Order.aggregate([
                {$match: filter},
                { $lookup: {from: "users",localField: "user_id",foreignField: "_id",as: "user"}},
                { $unwind: {"path": "$user","preserveNullAndEmptyArrays": true}},
                {$match: {$and: query}},
                {$project: {orderId: "$_id", userName: "$user.fullName", userId: "$user.registerId", final_price:1}},
                {$sort: {_id:-1}},
                {$limit:20}
            ])
            return this.res.send({ status: 1, message: "Details are: ", data: orders });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get wallet amount
    Method: POST
    {
        "userId":"",
        "sellerId":"",
        "type":"user" or "seller"
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getWalletAmount() {
        try {
            const data = this.req.body;
            if (!data.type) {
                return this.res.send({ status: 0, message: "Please pass type of the wallet to be modified" });
            }
            if(data.userId && data.type == "user"){
                const userWallet = await Users.findOne({ _id: data.userId, isDeleted:false }, { wallet:1, _id:1, fullName:1, registerId:1 });
                if (_.isEmpty(userWallet))
                    return this.res.send({ status: 0, message: "User not found" });
                return this.res.send({ status: 1, message: "Details are: ", data: userWallet });
            }
            else if(data.sellerId && data.type == "seller"){
                const sellerWallet = await Sellers.findOne({ _id: data.sellerId, isDeleted:false }, { wallet:1, _id:1,  fullName:1, registerId:1 });
                if (_.isEmpty(sellerWallet))
                    return this.res.send({ status: 0, message: "Seller not found" });
                return this.res.send({ status: 1, message: "Details are: ", data: sellerWallet });
            }
            else{
                return this.res.send({ status: 0, message: "Please send proper request params" });
            }
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
   Purpose: Add Wallet Amount
   Method: Post
   Authorisation: true
   Parameter:
      {
          "userId": "", or sellerId: ""
          "orderId": "",
          "reason": "Adding amount for order replacement",
          "existingWalletAmount": 0,
          "walletAmount": 100,
          "transactionPassword":"Test@123",
          "type": "user", // or seller
      }
   Return: JSON String
   ********************************************************/
   async addWalletAmount() {
    try {
        let data = this.req.body;
        if(!data.type){
            return this.res.send({ status: 0, message: "Please pass type of the wallet to be modified" });
        }
        const fields = ["orderId","reason","existingWalletAmount","walletAmount", "type", "transactionPassword"]
        const fieldsArray = data.type == "user" ?[ "userId", ...fields]: ["sellerId", ...fields]
        const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
        if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
            return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
        }
        console.log(`adminId: ${this.req.user}`)
        const admin = await Admin.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
        if (_.isEmpty(admin)) {
            return this.res.send({ status: 0, message: "Admin not found"});
        }
        if(data.userId){
            const user = await Users.findOne({ _id: data.userId, isDeleted:false }, { _id:1 });
            if (_.isEmpty(user)){
                return this.res.send({ status: 0, message: "User not found" });
            }
        }
        if(data.sellerId){
            const seller = await Sellers.findOne({ _id: data.sellerId, isDeleted:false }, { _id:1 });
            if (_.isEmpty(seller)){
                return this.res.send({ status: 0, message: "Seller not found" });
            }
        }
        if(data.orderId){
            const order = await Order.findOne({ _id: data.orderId }, { _id:1 });
            if (_.isEmpty(order)){
                return this.res.send({ status: 0, message: "Order not found" });
            }
        }
        data.adminId = this.req.user;
        data.ipAddress = this.req.ip
        const newWallet = await new Model(WalletManagements).store(data);
        if (_.isEmpty(newWallet)) {
            return this.res.send({ status: 0, message: "Details not saved" });
        }
        const newWalletAmount = data.existingWalletAmount + data.walletAmount;
        await Users.findOneAndUpdate({_id: data.userId}, {wallet: newWalletAmount}, {new:true, upsert:true})
        return this.res.send({ status: 1, message: "Wallet details saved successfully", data: newWallet });
    } catch (error) {
        console.log("error- ", error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
    }

    /********************************************************
    Purpose: wallets amount listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "type": "user" or "seller"
    }
    Return: JSON String
    ********************************************************/
    async walletAmountsListing() {
        try {
            const data = this.req.body;
            if(!data.type){
                 return this.res.send({ status: 0, message: "Please pass type of the wallet to be modified" });
            }
            const skip = data.page? (parseInt(data.page) - 1) * parseInt(data.pagesize): 0;
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize? data.pagesize: 20
            const filter = data.type == 'user'?  {userId: {$exists: true}} : {sellerId: {$exists: true}}
            const projectData = data.type == 'user'?  { userName:"$user.fullName", userId: "$user.registerId",} : { sellerName:"$seller.fullName",sellerId: "$seller.registerId",}
            const result = await WalletManagements.aggregate([
                {$match: {isDeleted: false, ...filter}},
                ...walletAmountListingStages,
                {$project: {
                    _id:1,
                    ...projectData,
                    orderId: "$order._id",
                    orderAmount: "$order.total_price",
                    reason: 1,
                    existingWalletAmount:1,
                    walletAmount:1, 
                    staffId: "$admin.registerId",
                    staffName: "$admin.fullName",
                    staffRole: "$admin.role",
                    ipAddress:1,
                    createdAt:1,
                    updatedAt:1
                }},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await WalletManagements.aggregate([
                {$match: {isDeleted: false, ...filter}},
                ...walletAmountListingStages,
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = WalletManagementController;