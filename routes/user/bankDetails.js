const BankDetailsController = require('../../controller/user/bankDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/addAndUpdateBankDetails', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.addAndUpdateBankDetails();
    });

    router.post('/getBankDetails', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetails();
    });

    router.post('/deleteBankDetails', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.deleteBankDetails();
    });

    router.get('/getBankDetailsOfUser', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetailsOfUser();
    });
}