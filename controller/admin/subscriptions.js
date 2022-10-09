const _ = require("lodash");

const Controller = require("../base");
const { Subscriptions } = require('../../models/s_subscriptions');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const DownloadsController = require('../common/downloads')


const listingStages = [{
	$project: {
		packageName: 1,
		amount: 1,
		productsLimit: 1,
		duration: 1,
		logo: 1,
		status: 1,
        createdAt: 1
	}
}]
const downloadFilesStages = [{
	$project: {
        "Date":{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata"} },
        "Package Name": "$packageName",
        "Amount": "$amount",
        "Products Limit":"$productsLimit",
		"Duration": "$duration",
        "Logo":"$logo",
        "Status":"$status"
	}
}]


class SubscriptionsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
    /********************************************************
   Purpose: Create and Update Subscriptions
   Method: Post
   Authorisation: true
   Parameter:
      {
            "packageName": "Premium",
            "amount": 500,
            "productsLimit": 10,
            "duration": 30,
            "logo": "30",
            "subscriptionId":"" //optional
      }
   Return: JSON String
   ********************************************************/
   async addAndUpdateSubscriptions() {
    try {
        let data = this.req.body;
        const fieldsArray = ["packageName","amount","productsLimit","duration", "logo"]
        const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
        if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
            return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
        }
        data.pointsValidity = new Date(data.pointsValidity);
        if(data.subscriptionId){
            const subscriptions = await Subscriptions.findOne({_id: data.subscriptionId, isDeleted: false})
            if (_.isEmpty(subscriptions)) {
                return this.res.send({ status: 0, message: "Details are not found" });
            }
            const checkSubscriptions = await Subscriptions.findOne({packageName: data.packageName, isDeleted: false, _id: {$nin: [data.subscriptionId]}})
            if (!_.isEmpty(checkSubscriptions)) {
                return this.res.send({ status: 0, message: `${data.packageName} already exists` });
            }
            const updatedSubscription = await Subscriptions.findOneAndUpdate({_id: data.subscriptionId},data,{upsert:true, new:true})
            if (_.isEmpty(updatedSubscription)) {
                return this.res.send({ status: 0, message: "Details are not updated" });
            }
            return this.res.send({ status: 1, message: "Subscription details updated successfully", data: updatedSubscription });
       
        }else{
            const subscriptions = await Subscriptions.findOne({packageName: data.packageName, isDeleted: false})
            if (!_.isEmpty(subscriptions)) {
                return this.res.send({ status: 0, message: `${data.packageName} already exists` });
            }
            const newSubscription = await new Model(Subscriptions).store(data);
            if (_.isEmpty(newSubscription)) {
                return this.res.send({ status: 0, message: "Details not saved" });
            }
            return this.res.send({ status: 1, message: "Subscription details created successfully", data: newSubscription });
        }
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
            const subscriptions = await Subscriptions.findOne({ _id: this.req.params.subscriptionId, isDeleted:false }, { __v: 0 });
            if (_.isEmpty(subscriptions))
                return this.res.send({ status: 0, message: "Subscription not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: subscriptions });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
     Purpose: single and multiple subscriptions change status
     Parameter:
     {
        "subscriptionIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfSubscriptions() {
        try {
            let msg = "Subscription status not updated";
            const updatedSubscriptions = await Subscriptions.updateMany({ _id: { $in: this.req.body.subscriptionIds } }, { $set: { status: this.req.body.status } });
            if (updatedSubscriptions) {
                msg = updatedSubscriptions.modifiedCount ? updatedSubscriptions.modifiedCount + " subscription updated" : updatedSubscriptions.matchedCount == 0 ? "Subscription not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
       Purpose: Delete Single And Multiple Subscriptions Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "subscriptionIds":["5cd01da1371dc7190b085f86"]
       }
       Return: JSON String
       ********************************************************/
       async deleteSubscriptions() {
        try {
            if (!this.req.body.subscriptionIds) {
                return this.res.send({ status: 0, message: "Please send subscriptionIds" });
            }
            let msg = 'Subscription not deleted.';
            let status = 1;
            const updatedSubscriptions = await Subscriptions.updateMany({ _id: { $in: this.req.body.subscriptionIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedSubscriptions) {
                msg = updatedSubscriptions.modifiedCount ? updatedSubscriptions.modifiedCount + ' subscriptions deleted.' : updatedSubscriptions.matchedCount== 0 ? "Details not found" : msg;
                status = updatedSubscriptions.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
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
            const result = await Subscriptions.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...listingStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Subscriptions.count({isDeleted:false, $and: query})
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total});
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
            "filteredFields": ["Date", "Package Name", "Amount", "Products Limit", "Logo", "Duration", "Status"] 
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
            ["Date", "Package Name", "Amount", "Products Limit", "Logo", "Duration", "Status"]

            data['model'] = Subscriptions;
            data['projectData'] = downloadFilesStages;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['fileName'] = 'subscriptions'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = SubscriptionsController;