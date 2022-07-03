const KycDetailsController = require('../../controller/user/kycDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/addAndUpdateKycDetails', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.addAndUpdateKycDetails();
    });

    router.post('/getKycDetails', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.getKycDetails();
    });

    router.post('/deleteKycDetails', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.deleteKycDetails();
    });

    router.get('/getKycDetailsOfUser', isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.getKycDetailsOfUser();
    });
}