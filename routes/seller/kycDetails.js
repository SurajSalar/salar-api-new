const KycDetailsController = require('../../controller/seller/kycDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/kyc', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.addUpdateKycDetails();
    });

    router.get('/kyc/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.kycDetails();
    });

    router.delete('/kyc/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.deleteKycDetails();
    });

    router.get('/kycOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.kycDetailsOfSeller();
    });
}