const UserManagementController = require('../../controller/admin/userManagement');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/usersListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const userObj = (new UserManagementController()).boot(req, res);
        return userObj.usersListing();
    });

    router.get('/getUserDetails/:userId', Authorization.isAdminAuthorised, (req, res, next) => {
        const userObj = (new UserManagementController()).boot(req, res);
        return userObj.getUserDetails();
    });

    router.post('/deleteUsers', Authorization.isAdminAuthorised, (req, res, next) => {
        const userObj = (new UserManagementController()).boot(req, res);
        return userObj.deleteUsers();
    });

    router.post('/downloadUserFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const userObj = (new UserManagementController()).boot(req, res);
        return userObj.downloadUserFiles();
    });

    router.post('/loginHistory', Authorization.isAdminAuthorised, (req, res, next) => {
        const userObj = (new UserManagementController()).boot(req, res);
        return userObj.loginHistory();
    });

    router.get('/getLoginHistoryDetailsOfUser/:loginHistoryId', Authorization.isAdminAuthorised, (req, res, next) => {
        const userObj = (new UserManagementController()).boot(req, res);
        return userObj.getLoginHistoryDetailsOfUser();
    });

    router.post('/downloadLoginHistoryFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const userObj = (new UserManagementController()).boot(req, res);
        return userObj.downloadLoginHistoryFiles();
    });

}