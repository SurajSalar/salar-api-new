const EtdDetailsController = require('../../controller/seller/etdDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/etd', isAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.addUpdateEtdDetails();
    });

    router.get('/etd/:id', isAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.etdDetails();
    });

    router.delete('/etd/:id', isAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.deleteEtdDetails();
    });

    router.get('/etdOfSeller', isAuthorised, (req, res, next) => {
        const etdObj = (new EtdDetailsController()).boot(req, res);
        return etdObj.etdDetailsOfSeller();
    });
}