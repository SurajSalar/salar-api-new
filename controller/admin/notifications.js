const _ = require("lodash");

const Controller = require("../base");
const { Notifications } = require('../../models/s_notifications');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads');
const { Users } = require("../../models/s_users");
const { Sellers } = require("../../models/s_sellers");
const { Admin } = require("../../models/s_admin");


class NotificationsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

      /********************************************************
        Purpose: Add and update Notification details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "title": "Title",
            "type": "User",
            "file": "image.png",
            "message":"message",
            "notificationId": "" //optional 
        }               
        Return: JSON String
    ********************************************************/
    async addAndUpdateNotification() {
        try {
            let data = this.req.body;
            const fieldsArray = ["type", "title", "file", "message"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if(data.notificationId){
                await Notifications.findByIdAndUpdate(data.notificationId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Notification details updated successfully" });
            }else{
                let count = await Notifications.count();
                if(count <= 8){
                    count = '0'+ (count+1);
                }
                const randomText = (await this.commonService.randomGenerator(2,'number') +await this.commonService.randomGenerator(1,'capital')+await this.commonService.randomGenerator(2,'number') )
                data['notificationNo'] = 'N'+randomText+ count
                const newNotification = await new Model(Notifications).store(data);
                if (_.isEmpty(newNotification)) {
                    return this.res.send({ status: 0, message: "Notification details not saved" })
                }
                return this.res.send({ status: 1, message: "Notification details added successfully"});
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Get Notification Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getNotificationDetails() {
        try {
            const data = this.req.params;
            if (!data.notificationId) {
                return this.res.send({ status: 0, message: "Please send notificationId" });
            }
            const Notification = await Notifications.findOne({ _id: data.notificationId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(Notification)) {
                return this.res.send({ status: 0, message: "Notification details not found" });
            }
            return this.res.send({ status: 1, data: Notification });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple notifications to publish
     Parameter:
     {
        "notificationIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
     }
     Return: JSON String
     ********************************************************/
     async publishNotification() {
        try {
            const data = this.req.body;
            if(!data.notificationIds){
                return this.res.send({ status: 0, message: "Please send notificationIds" });
            }
            for(let i=0; i< data.notificationIds.length; i++){
                const notification = await Notifications.findOne({_id: data.notificationIds[i], isDeleted: false })
                if(!_.isEmpty(notification)){
                    data.userIds = notification.type == 'User' || notification.type == 'All' ? await this.getUserIds(): []
                    data.sellerIds = notification.type == 'Seller' || notification.type == 'All' ? await this.getSellerIds(): []
                    data.adminIds = notification.type == 'Staff' || notification.type == 'All' ? await this.getAdminIds(): []
                    data.publishedDate = new Date();
                    data.isPublished = true
                }
                const updateNotification = await Notifications.findOneAndUpdate({_id: data.notificationIds[i], isDeleted: false}, data, {new:true, upsert:true});
                if (_.isEmpty(updateNotification)) {
                    return this.res.send({ status: 0, message: "Notification details not saved" })
                }
            }
            return this.res.send({ status: 1, message: "Notifications published successfully" });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    async getUserIds(){
        try{
            let userIds =[]
            const users = await Users.find({isDeleted: false}, {_id:1})
            await users.map(user=>{
                userIds.push(user._id)
            });
            return userIds;
        }catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getSellerIds(){
        try{
            let sellerIds =[]
            const sellers = await Sellers.find({isDeleted: false}, {_id:1})
            await sellers.map(seller=>{
                sellerIds.push(seller._id)
            });
            return sellerIds;
        }catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getAdminIds(){
        try{
            let adminIds =[]
            const admins = await Admin.find({isDeleted: false}, {_id:1})
            await admins.map(admin=>{
                adminIds.push(admin._id)
            });
            return adminIds;
        }catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
     /********************************************************
    Purpose: Delete Notification details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "notificationIds":["5c9df24382ddca1298d855bb"]
    }  
    Return: JSON String
    ********************************************************/
    async deleteNotifications() {
        try {
            if (!this.req.body.notificationIds) {
                return this.res.send({ status: 0, message: "Please send notificationIds" });
            }
            let msg = 'Notification not deleted.';
            let status = 1;
            const updatedNotifications = await Notifications.updateMany({ _id: { $in: this.req.body.notificationIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedNotifications) {
                msg = updatedNotifications.modifiedCount ? updatedNotifications.modifiedCount + ' notification deleted.' : updatedNotifications.matchedCount== 0 ? "Details not found" : msg;
                status = updatedNotifications.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: notifications Listing In Admin
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
    async notificationsListing() {
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
                query.push({ $or: [{ notificationNo: regex }, { title: regex },{ message: regex }, { type: regex }] })
            }
            const result = await Notifications.aggregate([
                {$match: { isDeleted: false, $and: query}},
                {$project: {createdAt:1, notificationNo:1, title:1, type:1, message:1,
                file:1, isPublished:1, publishedDate:1}},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Notifications.aggregate([
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
            "filteredFields": ["Date","Notification No","Title" ,"Type","Message","File","Status", "Published Date"] 
        }
       Return: JSON String
       ********************************************************/
       async downloadNotificationFiles() {
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
                ["Date","Notification No","Title" ,"Type","Message","File","Status", "Published Date"]
            if(data.searchText){
                const regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ notificationNo: regex }, { title: regex },{ message: regex }, { type: regex }] })
            }
            data['model'] = Notifications;
            data['stages'] = [];
            data['projectData'] = [{$project:{Date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata"} }, "Notification No": "$notificationNo",
             Title: "$title", Message: "$message", Type:"$type", File: "$file",Status: "$isPublished", "Published Date": { $dateToString:{ format: "%Y-%m-%d", date: "$publishedDate", timezone: "Asia/Kolkata"}}}}];
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['filterQuery'] = {}
            data['fileName'] = 'notifications'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = NotificationsController;