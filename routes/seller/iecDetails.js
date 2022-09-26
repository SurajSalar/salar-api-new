const IecDetailsController = require('../../controller/seller/iecDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/iec', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.addUpdateIecDetails();
    });

    router.get('/iec/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.iecDetails();
    });

    router.delete('/iec/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.deleteIecDetails();
    });

    router.get('/iecOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.iecDetailsOfSeller();
    });
}