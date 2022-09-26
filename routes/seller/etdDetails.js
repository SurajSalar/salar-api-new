const EtdDetailsController = require('../../controller/seller/etdDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/etd', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.addUpdateEtdDetails();
    });

    router.get('/etd/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.etdDetails();
    });

    router.delete('/etd/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.deleteEtdDetails();
    });

    router.get('/etdOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.etdDetailsOfSeller();
    });
}