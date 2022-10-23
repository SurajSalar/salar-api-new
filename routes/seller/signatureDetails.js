const SignatureDetailsController = require('../../controller/seller/signatureDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateSignatureDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.addAndUpdateSignatureDetails();
    });

    router.get('/seller/getSignatureDetails/:signatureId', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.getSignatureDetails();
    });

    router.post('/seller/deleteSignatureDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.deleteSignatureDetails();
    });

    router.get('/seller/getSignatureDetailsOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const signatureObj = (new SignatureDetailsController()).boot(req, res);
        return signatureObj.getSignatureDetailsOfSeller();
    });
}