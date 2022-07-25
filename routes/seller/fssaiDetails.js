const FssaiDetailsController = require('../../controller/seller/fssaiDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/fssai', isAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.addUpdateFssaiDetails();
    });

    router.get('/fssai/:id', isAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.fssaiDetails();
    });

    router.delete('/fssai/:id', isAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.deleteFssaiDetails();
    });

    router.get('/fssaiOfSeller', isAuthorised, (req, res, next) => {
        const fssaiObj = (new FssaiDetailsController()).boot(req, res);
        return fssaiObj.fssaiDetailsOfSeller();
    });
}