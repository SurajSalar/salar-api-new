const SellerManagementController = require('../../controller/admin/sellerManagement');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/seller/sellersListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.sellersListing();
    });

    router.get('/seller/getSellerDetails/:sellerId', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.getSellerDetails();
    });

    router.post('/seller/deleteSellers', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.deleteSellers();
    });

    router.post('/seller/downloadSellerFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.downloadSellerFiles();
    });

    router.post('/seller/loginHistory', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.loginHistory();
    });

    router.get('/seller/getLoginHistoryDetailsOfSeller/:loginHistoryId', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.getLoginHistoryDetailsOfSeller();
    });

    router.post('/seller/downloadLoginHistoryFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.downloadLoginHistoryFiles();
    });

    router.post('/seller/kycSellersListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.kycSellersListing();
    });

    router.get('/seller/getKycSellerDetails/:sellerId', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.getKycSellerDetails();
    });

    router.post('/seller/downloadKycSellerFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.downloadKycSellerFiles();
    });

    router.post('/seller/updateKycStatusofSellerByAdmin', Authorization.isAdminAuthorised, (req, res, next) => {
        const sellerObj = (new SellerManagementController()).boot(req, res);
        return sellerObj.updateKycStatusofSellerByAdmin();
    });
}