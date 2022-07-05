const SupportTicketsController = require('../../controller/common/supportTickets');

module.exports = (router, app) => {
    router.post('/createSupportTicket', (req, res, next) => {
        const ticketObj = (new SupportTicketsController()).boot(req, res);
        return ticketObj.createSupportTicket();
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

}