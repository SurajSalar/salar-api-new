const IecDetailsController = require('../../controller/seller/iecDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/iec', isAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.addUpdateIecDetails();
    });

    router.get('/iec/:id', isAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.iecDetails();
    });

    router.delete('/iec/:id', isAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.deleteIecDetails();
    });

    router.get('/iecOfSeller', isAuthorised, (req, res, next) => {
        const iecObj = (new IecDetailsController()).boot(req, res);
        return iecObj.iecDetailsOfSeller();
    });
}