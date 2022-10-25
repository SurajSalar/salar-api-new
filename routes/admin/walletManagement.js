const WalletManagementController = require('../../controller/admin/walletManagement');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/admin/getUsersList', Authorization.isAdminAuthorised, (req, res, next) => {
        const walletObj = (new WalletManagementController()).boot(req, res);
        return walletObj.getUsersList();
    });

    router.post('/admin/getSellersList', Authorization.isAdminAuthorised, (req, res, next) => {
        const walletObj = (new WalletManagementController()).boot(req, res);
        return walletObj.getSellersList();
    });

    router.post('/admin/getOrdersList', Authorization.isAdminAuthorised, (req, res, next) => {
        const walletObj = (new WalletManagementController()).boot(req, res);
        return walletObj.getOrdersList();
    });

    router.post('/admin/getWalletAmount', Authorization.isAdminAuthorised, (req, res, next) => {
        const walletObj = (new WalletManagementController()).boot(req, res);
        return walletObj.getWalletAmount();
    });

    router.post('/admin/addWalletAmount', Authorization.isAdminAuthorised, (req, res, next) => {
        const walletObj = (new WalletManagementController()).boot(req, res);
        return walletObj.addWalletAmount();
    });

    router.post('/admin/walletAmountsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const walletObj = (new WalletManagementController()).boot(req, res);
        return walletObj.walletAmountsListing();
    });
}