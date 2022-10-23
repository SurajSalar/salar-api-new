const UserProfileController = require('../../controller/user/userProfile');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/changePassword',Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.changePassword();
    });

    router.post('/changeTransactionPasswordRequest', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.changeTransactionPasswordRequest();
    });

    router.post('/changeTransactionPassword', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.changeTransactionPassword();
    });

    router.get('/getUserProfile', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.getUserProfile();
    });

    router.post('/editUserProfile', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.editUserProfile();
    });

    router.post('/addShippingAddress', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.addShippingAddress();
    });

    router.post('/updateShippingAddress', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.updateShippingAddress();
    });

    router.post('/deleteShippingAddress', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.deleteShippingAddress();
    });

    router.get('/userManageAddress', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.userManageAddress();
    });

    router.post('/setDefaultAddress', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.setDefaultAddress();
    });
    
    router.get('/getShippingAddress', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.getShippingAddress();
    });

    router.post('/userTeamListing', Authorization.isAuthorised, (req, res, next) => {
        const userObj = (new UserProfileController()).boot(req, res);
        return userObj.userTeamListing();
    });
}