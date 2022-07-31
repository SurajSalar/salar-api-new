const SupportTicketsController = require('../../controller/admin/supportTickets');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/ticketsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.ticketsListing();
    });

    router.get('/getTicketDetails/:ticketId',  Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.getTicketDetails();
    });

    router.post('/deleteTickets',  Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.deleteTickets();
    });

}