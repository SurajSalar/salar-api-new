const IecDetailsController = require('../../controller/seller/iecDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateIecDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.addAndUpdateIecDetails();
    });

    router.get('/seller/getIecDetails/:iecId', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.getIecDetails();
    });

    router.post('/seller/deleteIecDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.deleteIecDetails();
    });

    router.get('/seller/getIecDetailsOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.getIecDetailsOfSeller();
    });
}