const UsersController = require('../../controller/user/authentication');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/signUp', (req, res, next) => {
        const authObj = (new UsersController()).boot(req, res);
        return authObj.signUp();
    });

    router.post('/signIn', (req, res, next) => {
        const authObj = (new UsersController()).boot(req, res);
        return authObj.signIn();
    });

    router.post('/forgotPassword', (req, res, next) => {
        const authObj = (new UsersController()).boot(req, res);
        return authObj.forgotPassword();
    });

    router.post('/resetPassword', (req, res, next) => {
        const authObj = (new UsersController()).boot(req, res);
        return authObj.resetPassword();
    });

    router.get('/logOut', Authorization.isAuthorised,(req, res, next) => {
        const authObj = (new UsersController()).boot(req, res);
        return authObj.logOut();
    });
}