const SignatureDetailsController = require('../../controller/seller/signatureDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/signature', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.addUpdateSignatureDetails();
    });

    router.get('/signature/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.signatureDetails();
    });

    router.delete('/signature/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.deleteSignatureDetails();
    });

    router.get('/signatureOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.signatureDetailsOfSeller();
    });
}