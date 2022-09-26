const FssaiDetailsController = require('../../controller/seller/fssaiDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/fssai', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.addUpdateFssaiDetails();
    });

    router.get('/fssai/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.fssaiDetails();
    });

    router.delete('/fssai/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.deleteFssaiDetails();
    });

    router.get('/fssaiOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.fssaiDetailsOfSeller();
    });
}