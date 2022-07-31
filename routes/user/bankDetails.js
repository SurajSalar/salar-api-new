const BankDetailsController = require('../../controller/user/bankDetails');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/addAndUpdateBankDetails', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.addAndUpdateBankDetails();
    });

    router.post('/getBankDetails', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetails();
    });

    router.post('/deleteBankDetails', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.deleteBankDetails();
    });

    router.get('/getBankDetailsOfUser', Authorization.isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetailsOfUser();
    });
}