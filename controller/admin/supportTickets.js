const _ = require("lodash");

const Controller = require("../base");
const { Tickets } = require('../../models/s_ticket');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class SupportTicketsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
    /********************************************************
    Purpose: Tickets Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
    }
    Return: JSON String
    ********************************************************/
    async ticketsListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize
            const result = await Tickets.find({isDeleted:false}).populate('userId',{ fullName: 1 }).populate('adminId',{fullName:1}).sort(sort).skip(skip).limit(limit);
            const total = await Tickets.count({isDeleted: false});
            return this.res.send({status:1, message: "Listing details are: ", data: result, page: data.page, pagesize: data.pagesize, total: total});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get ticket Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getTicketDetails() {
        try {
            if (!this.req.params.ticketId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const ticket = await Tickets.findOne({ _id: this.req.params.ticketId, isDeleted:false }, { __v: 0 }).populate('userId',{ fullName: 1 }).populate('adminId',{fullName:1});
            if (_.isEmpty(ticket))
                return this.res.send({ status: 0, message: "Ticket not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: ticket });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
       Purpose: Delete Single And Multiple Ticket Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "ticketIds":["5cd01da1371dc7190b085f86"]
       }
       Return: JSON String
       ********************************************************/
       async deleteTickets() {
        try {
            if (!this.req.body.ticketIds) {
                return this.res.send({ status: 0, message: "Please send ticketIds" });
            }
            let msg = 'Ticket not deleted.';
            const updatedTickets = await Tickets.updateMany({ _id: { $in: this.req.body.ticketIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedTickets) {
                msg = updatedTickets.modifiedCount ? updatedTickets.modifiedCount + ' ticket deleted.' : updatedTickets.matchedCount== 0 ? "Details not found" : msg;
            }
            return this.res.send({ status: 1, message: msg });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = SupportTicketsController;