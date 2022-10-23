const SupportTicketsController = require('../../controller/common/supportTickets');

module.exports = (router, app) => {
    router.post('/createSupportTicket', (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.createSupportTicket();
    });

    router.get('/getDetailsOfSupportTicket/:ticketId', (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.getDetailsOfSupportTicket();
    });

    router.post('/sendAndUpdateMessage', (req, res, next) => {
        const messageObj = (new SupportTicketsController()).boot(req, res);
        return messageObj.sendAndUpdateMessage();
    });

    router.post('/getMessagesOfTicket', (req, res, next) => {
        const messageObj = (new SupportTicketsController()).boot(req, res);
        return messageObj.getMessagesOfTicket();
    });

    router.get('/getMessageDetails/:messageId', (req, res, next) => {
        const messageObj = (new SupportTicketsController()).boot(req, res);
        return messageObj.getMessageDetails();
    });

    router.post('/deleteMessage', (req, res, next) => {
        const messageObj = (new SupportTicketsController()).boot(req, res);
        return messageObj.deleteMessage();
    });

    router.post('/getTicketCategoriesList', (req, res, next) => {
        const messageObj = (new SupportTicketsController()).boot(req, res);
        return messageObj.getTicketCategoriesList();
    });

}