const KycDetailsController = require('../../controller/seller/kycDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateKycDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.addAndUpdateKycDetails();
    });

    router.get('/seller/getKycDetails/:kycId', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.getKycDetails();
    });

    router.post('/seller/deleteKycDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.deleteKycDetails();
    });

    router.get('/seller/getKycDetailsOfSeller', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.getKycDetailsOfSeller();
    });
}