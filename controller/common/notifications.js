const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { Notifications } = require('../../models/s_notifications');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class NotificationsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  /********************************************************
    Purpose: Get notifications of user  
    Method: POST
    {
        "page":1,
        "pagesize":3,
        "type": "user" or "seller" or "staff",
        "id":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getUnreadNotifications() {
        try {
            const data = this.req.body;
            const fieldsArray = ["page", "pagesize", "type", "id"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            const query = [{}];
            const user = data.type == "user"?"userIds": data.type == 'seller'? "sellerIds": "adminIds";
            const viewedUser = data.type == "user"?"viewedUserIds": data.type == 'seller'? "viewedSellerIds": "viewedAdminIds";

            if(data.searchText){
                const regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ notificationNo: regex }, { title: regex },{ message: regex }, { type: regex }] })
            }
            const result = await Notifications.aggregate([
                {$match: {$and: query, [user]: {$in:[ObjectID(data.id)]}, [viewedUser]: {$nin:[ObjectID(data.id)]}}},
                {$project: {createdAt:1, notificationNo:1, title:1, type:1, message:1,
                    file:1, isPublished:1, publishedDate:1}},
                    {$sort: sort},
                    {$skip: skip},
                    {$limit: limit},
            ])
            const total = await Notifications.aggregate([
                {$match: {$and: query, [user]: {$in:[ObjectID(data.id)]}, [viewedUser]: {$nin:[ObjectID(data.id)]}}},
                {$project: {_id:1}},
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
          } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Mark notifications as read  
    Method: POST
    {
        "notificationIds":[""],
        "type": "user" or "seller" or "staff",
        "id":""
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async markNotificationsAsread() {
        try {
            const data = this.req.body;
            const fieldsArray = ["notificationIds", "type", "id"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            let msg = "Notification status not updated";
            const user = data.type == "user"?"viewedUserIds": data.type == 'seller'? "viewedSellerIds": "viewedAdminIds";
            const notification = await Notifications.updateMany({ _id: { $in: data.notificationIds } }, { $push: { [user]: data.id } });
            if (notification) {
                msg = notification.modifiedCount ? notification.modifiedCount + " notification updated" : notification.matchedCount == 0 ? "Notification not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg }); } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = NotificationsController;