const BankDetailsController = require('../../controller/seller/bankDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/bankDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.addUpdateBankDetails();
    });

    router.get('/seller/bankDetails/:id', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetails();
    });

    router.post('/seller/deleteBankDetails', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.deleteBankDetails();
    });

    router.get('/seller/bankDetailsOfUser', Authorization.isSellerAuthorised, (req, res, next) => {
        const kycObj = (new BankDetailsController()).boot(req, res);
        return kycObj.getBankDetailsOfUser();
    });
}