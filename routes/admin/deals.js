const DealsController = require('../../controller/admin/deals');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/admin/addAndUpdateDeal', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.addAndUpdateDeal();
    });

    router.post('/admin/addandUpdateProductToDeal', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.addandUpdateProductToDeal();
    });

    router.post('/admin/deleteProductFromDeal', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.deleteProductFromDeal();
    });

    router.get('/admin/getDealDetails/:dealId', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.getDealDetails();
    });

    router.post('/admin/changeStatusOfDeals', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.changeStatusOfDeals();
    });

    router.post('/admin/deleteDeals', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.deleteDeals();
    });

    router.post('/admin/dealsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.dealsListing();
    });

    router.post('/admin/downloadDealFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.downloadDealFiles();
    });

    router.post('/admin/productsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.productsListing();
    });

    router.post('/admin/downloadProductsFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const dealObj = (new DealsController()).boot(req, res);
        return dealObj.downloadProductsFiles();
    });
}