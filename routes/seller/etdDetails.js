const EtdDetailsController = require('../../controller/seller/etdDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateEtdDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.addAndUpdateEtdDetails();
    });

    router.get('/seller/getEtdDetails/:etdId', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.getEtdDetails();
    });

    router.post('/seller/deleteEtdDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.deleteEtdDetails();
    });

    router.get('/seller/getEtdDetailsOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.getEtdDetailsOfSeller();
    });
}