const SellerProfileController = require('../../controller/seller/sellerProfile');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/changePassword',isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.changePassword();
    });

    router.post('/seller/changeTransactionPassword', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.changeTransactionPassword();
    });

    router.get('/seller/profile', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.getSellerProfile();
    });

    router.put('/seller/profile', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.editSellerProfile();
    });

    router.post('/seller/addShippingAddress', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.addShippingAddress();
    });

    router.post('/seller/updateShippingAddress', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.updateShippingAddress();
    });

    router.post('/seller/deleteShippingAddress', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.deleteShippingAddress();
    });

    router.get('/seller/userManageAddress', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.userManageAddress();
    });

    router.post('/seller/setDefaultAddress', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.setDefaultAddress();
    });
    
    router.get('/seller/getShippingAddress', isAuthorised, (req, res, next) => {
        const sellerObj = (new SellerProfileController()).boot(req, res);
        return sellerObj.getShippingAddress();
    });
}