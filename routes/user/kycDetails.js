const KycDetailsController = require('../../controller/user/kycDetails');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/addAndUpdateKycDetails', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.addAndUpdateKycDetails();
    });

    router.post('/getKycDetails', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.getKycDetails();
    });

    router.post('/deleteKycDetails', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.deleteKycDetails();
    });

    router.get('/getKycDetailsOfUser', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new KycDetailsController()).boot(req, res);
        return kycObj.getKycDetailsOfUser();
    });
}