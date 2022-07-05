const SupportTicketsController = require('../../controller/admin/supportTickets');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/ticketsListing', isAuthorised, (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.ticketsListing();
    });

    router.get('/getTicketDetails/:ticketId', isAuthorised, (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.getTicketDetails();
    });

    router.post('/deleteTickets', isAuthorised, (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.deleteTickets();
    });

}