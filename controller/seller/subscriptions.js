const _ = require("lodash");
const moment = require('moment');
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { SellerSubscriptions } = require('../../models/s_seller_subscriptions');
const { Subscriptions } = require('../../models/s_subscriptions');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const DownloadsController = require('../common/downloads');

const lookupStages = [
    { $lookup: {from: "subscriptions",localField: "subscriptionId",foreignField: "_id",as: "subscription"}},
    { $unwind: {"path": "$subscription","preserveNullAndEmptyArrays": true}},
 ]

const listingStages = [
    ...lookupStages,
    {
	$project: {
        createdAt: 1,
		orderId: 1,
		fromDate: 1,
		toDate: 1,
		status: 1,
        subscription:1,
        paymentType:1
	}
}]
const downloadFilesStages = [{
	$project: {
        "Date":{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata"} },
        "Order Id": "$orderId",
        "Product Name": "$subscription.packageName",
        "Final Price": "$subscription.amount",
        "Products Limit":"$subscription.productsLimit",
        "Valid From":{ $dateToString: { format: "%Y-%m-%d", date: "$fromDate", timezone: "Asia/Kolkata"} },
        "Valid To":{ $dateToString: { format: "%Y-%m-%d", date: "$toDate", timezone: "Asia/Kolkata"} },
        "Status":"$status",
        "Payment Type": "$paymentType"
	}
}]


class SubscriptionsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
    /********************************************************
   Purpose: Add Subscriptions
   Method: Post
   Authorisation: true
   Parameter:
      {
            "subscriptionId":"63427aa68bed54cff3611931",
            "paymentType": "Card" 
      }
   Return: JSON String
   ********************************************************/
   async addSubscriptions() {
    try {
        let data = this.req.body;
        data.sellerId = this.req.user;
        const fieldsArray = ["subscriptionId","paymentType"]
        const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
        if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
            return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
        }
        data.fromDate = new Date();
        const subscription = await Subscriptions.findOne({_id: data.subscriptionId, isDeleted: false})
        if (_.isEmpty(subscription)) {
            return this.res.send({ status: 0, message: "Subscription details not found" });
        }    
        data.status = "Paid"; // needs to implement payment gateway    
        data.toDate = new Date(moment(data.fromDate).add(subscription.duration, 'days'));
        let count = await SellerSubscriptions.count();
        if(count <= 8){
            count = '0'+ (count+1);
        }
        const randomText = (await this.commonService.randomGenerator(2,'number') +await this.commonService.randomGenerator(1,'capital')+await this.commonService.randomGenerator(2,'number') )
        data['orderId'] = 'SOR'+randomText+ count
        const newSubscription = await new Model(SellerSubscriptions).store(data);
        if (_.isEmpty(newSubscription)) {
            return this.res.send({ status: 0, message: "Subscription details not saved" });
        }
        return this.res.send({ status: 1, message: "Subscription details added successfully", data: newSubscription });
    } catch (error) {
        console.log("error- ", error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
}

  /********************************************************
    Purpose: Get Subscriptions Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getSubscriptionDetails() {
        try {
            if (!this.req.params.subscriptionId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const subscriptions = await SellerSubscriptions.findOne({ _id: this.req.params.subscriptionId, isDeleted:false }, { __v: 0 }).populate('subscriptionId',{ packageName: 1, amount:1, productsLimit:1});
            if (_.isEmpty(subscriptions))
                return this.res.send({ status: 0, message: "Subscription not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: subscriptions });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Subscriptions Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-16",
        "endDate":"2022-09-16"
    }
    Return: JSON String
    ********************************************************/
    async subscriptionsListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
                console.log(`query: ${JSON.stringify(query)}`)
            }
            const result = await SellerSubscriptions.aggregate([
                {$match: { isDeleted: false, $and: query, sellerId: ObjectID(this.req.user)}},
                ...listingStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await SellerSubscriptions.aggregate([
                {$match: { isDeleted: false, $and: query, sellerId: ObjectID(this.req.user)}},
                ...lookupStages,
                {$project:{_id:1}}
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
            "startDate":"2022-09-16",
            "endDate":"2022-09-16"
            "filteredFields": ["Date", "Order Id", "Product Name", "Final Price", "Products Limit", "Valid From", "Valid To", "Status", "Payment Type"] 
        }
       Return: JSON String
       ********************************************************/
       async downloadSubscriptionFiles() {
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
            ["Date", "Order Id", "Product Name", "Final Price", "Products Limit", "Valid From", "Valid To", "Status", "Payment Type"]

            data['model'] = SellerSubscriptions;
            data['stages'] = lookupStages;
            data['projectData'] = downloadFilesStages;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query, sellerId: ObjectID(this.req.user)};
            data['fileName'] = 'seller-subscriptions'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = SubscriptionsController;