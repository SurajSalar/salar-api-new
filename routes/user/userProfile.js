const UserProfileController = require('../../controller/user/userProfile');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/changePassword',isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.changePassword();
    });

    router.post('/changeTransactionPassword', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.changeTransactionPassword();
    });

    router.get('/getUserProfile', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.getUserProfile();
    });

    router.post('/editUserProfile', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.editUserProfile();
    });

    router.post('/addShippingAddress', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.addShippingAddress();
    });

    router.post('/updateShippingAddress', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.updateShippingAddress();
    });

    router.post('/deleteShippingAddress', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.deleteShippingAddress();
    });

    router.get('/userManageAddress', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.userManageAddress();
    });

    router.post('/setDefaultAddress', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.setDefaultAddress();
    });
    
    router.get('/getShippingAddress', isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.getShippingAddress();
    });
}