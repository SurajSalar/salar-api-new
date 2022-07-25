const BankDetailsController = require('../../controller/seller/bankDetails');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/bankDetails', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.addUpdateBankDetails();
    });

    router.get('/bankDetails/:id', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetails();
    });

    router.delete('/bankDetails/:id', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.deleteBankDetails();
    });

    router.get('/bankDetailsOfUser', isAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetailsOfUser();
    });
}