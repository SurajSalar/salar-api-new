const _ = require("lodash");

const Controller = require("../base");
const { TicketCategories } = require('../../models/s_ticket_categories');
const RequestBody = require("../../utilities/requestBody");
const DownloadsController = require('../common/downloads')
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");


class TicketCategoriesController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  

    /********************************************************
    Purpose: Create and Update Ticket Category
    Method: Post
    Authorisation: true
    Parameter:
       {
           "subject": "Support Ticket",
           "ticketCategoryId":"" //optional
       }
    Return: JSON String
    ********************************************************/
    async createAndUpdateTicketCategory() {
        try {
            let data = this.req.body;
            if(!data.subject){
                return this.res.send({ status: 0, message: "Please send subject details" });
            }
            if (data.ticketCategoryId) {
                const ticketCategory = await TicketCategories.findOne({ subject: data.subject, isDeleted: false, _id: {$ne: data.ticketCategoryId} });
                if (!_.isEmpty(ticketCategory)) {
                    return this.res.send({ status: 0, message: "Subject already exists" });
                }
                const ticket = await TicketCategories.findOne({ _id: data.ticketCategoryId, isDeleted: false });
                if (_.isEmpty(ticket)) {
                    return this.res.send({ status: 0, message: "Ticket Category details not found" });
                }
                await TicketCategories.findByIdAndUpdate(data.ticketCategoryId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Ticket Category details updated successfully" });
            } else {
                const ticket = await TicketCategories.findOne({ subject: data.subject, isDeleted: false });
                if (!_.isEmpty(ticket)) {
                    return this.res.send({ status: 0, message: "Subject already exists" });
                }
                const newTicketCategory = await new Model(TicketCategories).store(data);
                if (_.isEmpty(newTicketCategory)) {
                    return this.res.send({ status: 0, message: "Details not saved" });
                }
                return this.res.send({ status: 1, message: "Ticket Category details added successfully", data: newTicketCategory });
            }
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: TicketCategories Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-20",
        "endDate":"2022-09-25",
    }
    Return: JSON String
    ********************************************************/
    async ticketCategoriesListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
            }
            const result = await TicketCategories.find({isDeleted:false, $and: query}).sort(sort).skip(skip).limit(limit);
            const total = await TicketCategories.count({isDeleted: false, $and: query});
            return this.res.send({status:1, message: "Listing details are: ", data: result, page: data.page, pagesize: data.pagesize, total: total});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get ticket category Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getTicketCategoryDetails() {
        try {
            if (!this.req.params.ticketCategoryId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const ticketCategory = await TicketCategories.findOne({ _id: this.req.params.ticketCategoryId, isDeleted:false }, { __v: 0 });
            if (_.isEmpty(ticketCategory))
                return this.res.send({ status: 0, message: "Ticket Category not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: ticketCategory });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
       Purpose: Delete Single And Multiple Ticket Category Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "ticketCategoryIds":["5cd01da1371dc7190b085f86"]
       }
       Return: JSON String
       ********************************************************/
       async deleteTicketCategories() {
        try {
            if (!this.req.body.ticketCategoryIds) {
                return this.res.send({ status: 0, message: "Please send ticketCategoryIds" });
            }
            let msg = 'Ticket not deleted.';
            const updatedTicketCategories = await TicketCategories.updateMany({ _id: { $in: this.req.body.ticketCategoryIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedTicketCategories) {
                msg = updatedTicketCategories.modifiedCount ? updatedTicketCategories.modifiedCount + ' ticket deleted.' : updatedTicketCategories.matchedCount== 0 ? "Details not found" : msg;
            }
            return this.res.send({ status: 1, message: msg });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
       Purpose: Change status of Single And Multiple Ticket Category Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "ticketCategoryIds":["5cd01da1371dc7190b085f86"],
           "status": true
       }
       Return: JSON String
       ********************************************************/
       async changeStatusOfTicketCategories() {
        try {
            const data = this.req.body;
            let msg = 'Ticket Category not updated.';
            const updatedTicketCategories = await TicketCategories.updateMany({ _id: { $in: this.req.body.ticketCategoryIds }, isDeleted: false }, { $set: { status: data.status } });
            if (updatedTicketCategories) {
                msg = updatedTicketCategories.modifiedCount ? updatedTicketCategories.modifiedCount + ' ticket category updated.' : updatedTicketCategories.matchedCount== 0 ? "Details not found" : msg;
            }
            return this.res.send({ status: 1, message: msg });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = TicketCategoriesController;