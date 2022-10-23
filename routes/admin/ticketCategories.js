const TicketCategoriesController = require('../../controller/admin/ticketCategories');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {

    router.post('/createAndUpdateTicketCategory', Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new TicketCategoriesController()).boot(req, res);
        return ticketObj.createAndUpdateTicketCategory();
    });

    router.post('/ticketCategoriesListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new TicketCategoriesController()).boot(req, res);
        return ticketObj.ticketCategoriesListing();
    });

    router.get('/getTicketCategoryDetails/:ticketCategoryId', Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new TicketCategoriesController()).boot(req, res);
        return ticketObj.getTicketCategoryDetails();
    });

    router.post('/deleteTicketCategories', Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new TicketCategoriesController()).boot(req, res);
        return ticketObj.deleteTicketCategories();
    });

    router.post('/changeStatusOfTicketCategories', Authorization.isAdminAuthorised, (req, res, next) => {
        const ticketObj = (new TicketCategoriesController()).boot(req, res);
        return ticketObj.changeStatusOfTicketCategories();
    });

}