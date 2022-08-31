const SignatureDetailsController = require('../../controller/seller/signatureDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/signature', isAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.addUpdateSignatureDetails();
    });

    router.get('/signature/:id', isAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.signatureDetails();
    });

    router.delete('/signature/:id', isAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.deleteSignatureDetails();
    });

    router.get('/signatureOfSeller', isAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.signatureDetailsOfSeller();
    });
}