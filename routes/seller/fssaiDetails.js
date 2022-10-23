const FssaiDetailsController = require('../../controller/seller/fssaiDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateFssaiDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.addAndUpdateFssaiDetails();
    });

    router.get('/seller/getFssaiDetails/:fssaiId', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.getFssaiDetails();
    });

    router.post('/seller/deleteFssaiDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.deleteFssaiDetails();
    });

    router.get('/seller/getFssaiDetailsOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.getFssaiDetailsOfSeller();
    });
}