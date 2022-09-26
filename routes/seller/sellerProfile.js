const SellerProfileController = require('../../controller/seller/sellerProfile');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/changePassword',Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.changePassword();
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

    router.post('/seller/addShippingAddress', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.addShippingAddress();
    });

    router.post('/seller/updateShippingAddress', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.updateShippingAddress();
    });

    router.post('/seller/deleteShippingAddress', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.deleteShippingAddress();
    });

    router.get('/seller/userManageAddress', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.userManageAddress();
    });

    router.post('/seller/setDefaultAddress', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.setDefaultAddress();
    });
    
    router.get('/seller/getShippingAddress', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.getShippingAddress();
    });
}