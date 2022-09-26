const BankDetailsController = require('../../controller/seller/bankDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/bankDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.addUpdateBankDetails();
    });

    router.get('/bankDetails/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetails();
    });

    router.delete('/bankDetails/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.deleteBankDetails();
    });

    router.get('/bankDetailsOfUser', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetailsOfUser();
    });
}