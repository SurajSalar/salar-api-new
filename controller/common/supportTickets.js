const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { Tickets } = require('../../models/s_ticket');
const { Messages } = require('../../models/s_message');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class SupportTicketsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

    /********************************************************
   Purpose: Create Support Ticket
   Method: Post
   Authorisation: true
   Parameter:
      {
          "message": "Support Ticket",
          "role": "user/seller/admin",
          "userId": "",
      }
   Return: JSON String
   ********************************************************/
    async createSupportTicket() {
        try {
            let data = this.req.body;
            if (!data.role) {
                return this.res.send({ status: 0, message: "Please send role" });
            }
            const fieldsArray = data.role == 'user' ? ["userId", "message"] : data.role == 'seller' ? ["sellerId", "message"] : ["adminId", "message"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }

            const newTicket = await new Model(Tickets).store(data);
            if (_.isEmpty(newTicket)) {
                return this.res.send({ status: 0, message: "Details not saved" });
            }
            return this.res.send({ status: 1, message: "Ticket created successfully", data: newTicket });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Send Message In Support Ticket
    Method: Post
    Authorisation: true
    Parameter:
       {
           "message": "Support Ticket",
           "role": "user",
           "userId": "",
           "ticketId": "",
           "messageId"
       }
    Return: JSON String
    ********************************************************/
    async sendAndUpdateMessage() {
        try {
            let data = this.req.body;
            if (!data.role) {
                return this.res.send({ status: 0, message: "Please send role" });
            }
            const fieldsArray = data.role == 'user' ? ["userId", "message", "ticketId"] : data.role == 'seller' ? ["sellerId", "message", "ticketId"] :["adminId", "message", "ticketId"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const ticket = await Tickets.findOne({ _id: data.ticketId, isDeleted: false });
            if (_.isEmpty(ticket)) {
                return this.res.send({ status: 0, message: "Ticket details not found" });
            }
            if (data.messageId) {
                const message = await Messages.findOne({ _id: data.messageId, isDeleted: false });
                if (_.isEmpty(message)) {
                    return this.res.send({ status: 0, message: "Message details not found" });
                }
                if (message.role != data.role) {
                    return this.res.send({ status: 0, message: "You don't have access to update this message" });
                }
                await Messages.findByIdAndUpdate(data.messageId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Message details updated successfully" });
            } else {
                const newMessage = await new Model(Messages).store(data);
                if (_.isEmpty(newMessage)) {
                    return this.res.send({ status: 0, message: "Details not saved" });
                }
                return this.res.send({ status: 1, message: "Message added successfully", data: newMessage });
            }

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
     Purpose: Messages of a support ticket
     Method: Post
     Authorisation: true
     Parameter:
     {
         "ticketId":""
     }
     Return: JSON String
     ********************************************************/
    async getMessagesOfTicket() {
        try {
            if (!this.req.body.ticketId) {
                return this.res.send({ status: 0, message: "Please send ticketId" });
            }
            const sort = { _id: 1 }
            const result = await Messages.find({ isDeleted: false, ticketId: ObjectID(this.req.body.ticketId) }).populate('userId', { fullName: 1 }).populate('sellerId', { fullName: 1 }).populate('adminId', { fullName: 1 }).sort(sort);
            return this.res.send({ status: 1, message: "Listing details are: ", data: result });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
  Purpose: Get Message Details
  Method: GET
  Authorisation: true
  Return: JSON String
  ********************************************************/
    async getMessageDetails() {
        try {
            if (!this.req.params.messageId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const message = await Messages.findOne({ _id: this.req.params.messageId, isDeleted: false }, { __v: 0 }).populate('userId', { fullName: 1 }).populate('sellerId', { fullName: 1 }).populate('adminId', { fullName: 1 });
            if (_.isEmpty(message))
                return this.res.send({ status: 0, message: "Message not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: message });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
       Purpose: Delete Message Details
       Method: Post
       Authorisation: true
       Parameter:
       {
           "messageId":"5cd01da1371dc7190b085f86",
           "role": "user",
           "adminId":"",
           "userId":""
       }
       Return: JSON String
       ********************************************************/
    async deleteMessage() {
        try {
            let data = this.req.body;
            if (!data.role) {
                return this.res.send({ status: 0, message: "Please send role" });
            }
            const fieldsArray = data.role == 'user' ? ["userId", "messageId"] : data.role == 'seller' ? ["sellerId", "messageId"] : ["adminId", "messageId"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const query = data.role == 'user' ? { userId: ObjectID(data.userId) } : data.role == 'seller' ? { sellerId: ObjectId(data.sellerId) } : { adminId: ObjectID(data.adminId) };
            const message = await Messages.findOne({ _id: data.messageId, ...query, isDeleted: false });
            if (_.isEmpty(message)) {
                return this.res.send({ status: 0, message: "Message details not found" });
            }

            let msg = 'Message not deleted.';
            const updatedMessage = await Messages.updateOne({ _id: this.req.body.messageId, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedMessage) {
                msg = updatedMessage.modifiedCount ? updatedMessage.modifiedCount + ' message deleted.' : updatedMessage.matchedCount == 0 ? "Details not found" : msg;
            }
            return this.res.send({ status: 1, message: msg });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = SupportTicketsController;