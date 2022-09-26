const SellersController = require('../../controller/seller/authentication');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/signUp', (req, res, next) => {
        const authObj = (new SellersController()).boot(req, res);
        return authObj.signUp();
    });

    router.post('/seller/signIn', (req, res, next) => {
        const authObj = (new SellersController()).boot(req, res);
        return authObj.signIn();
    });

    router.post('/seller/forgotPassword', (req, res, next) => {
        const authObj = (new SellersController()).boot(req, res);
        return authObj.forgotPassword();
    });

    // router.post('/seller/resetPassword', (req, res, next) => {
    //     const authObj = (new SellersController()).boot(req, res);
    //     return authObj.resetPassword();
    // });

    router.get('/seller/logOut', Authorization.isSellerAuthorised,(req, res, next) => {
        const authObj = (new SellersController()).boot(req, res);
        return authObj.logOut();
    });
}