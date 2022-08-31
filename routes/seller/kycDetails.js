const KycDetailsController = require('../../controller/seller/kycDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/kyc', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.addUpdateKycDetails();
    });

    router.get('/kyc/:id', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.kycDetails();
    });

    router.delete('/kyc/:id', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.deleteKycDetails();
    });

    router.get('/kycOfSeller', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.kycDetailsOfSeller();
    });
}