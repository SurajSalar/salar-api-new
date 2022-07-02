const UsersController = require('../../controller/user/authentication');

module.exports = (router, app) => {
    router.post('/signUp', (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.signUp();
    });

    router.post('/signIn', (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.signIn();
    });

    router.post('/forgotPassword', (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.forgotPassword();
    });

    router.post('/resetPassword', (req, res, next) => {
        const userObj = (new UsersController()).boot(req, res);
        return userObj.resetPassword();
    });
}