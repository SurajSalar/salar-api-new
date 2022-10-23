const SellerProfileController = require('../../controller/seller/sellerProfile');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/changePassword',Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.changePassword();
    });

    router.post('/seller/changeTransactionPasswordRequest', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.changeTransactionPasswordRequest();
    });

    router.post('/seller/changeTransactionPassword', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.changeTransactionPassword();
    });

    router.get('/seller/profile', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.getSellerProfile();
    });

    router.put('/seller/profile', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.editSellerProfile();
    });
}