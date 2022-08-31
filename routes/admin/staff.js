const AdminAuthController = require('../../controller/admin/authentication');

module.exports = (router, app) => {
    router.post('/admin-login', (req, res, next) => {
        const authObj = (new AdminAuthController()).boot(req, res);
        return authObj.signIn();
    });
}