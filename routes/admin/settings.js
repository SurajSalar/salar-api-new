const AdminEmailController = require('../../controller/admin/emailSettings');
const AdminEmailTemplateController = require('../../controller/admin/templateSettings');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.put('/email-setting', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminEmailController()).boot(req, res);
        return authObj.updateEmailSetting();
    });
    router.put('/template-setting', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminEmailTemplateController()).boot(req, res);
        return authObj.updateEmailTemplate();
    });
    router.post('/country', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminEmailController()).boot(req, res);
        return authObj.addCounty();
    });

    router.get('/countries', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminEmailController()).boot(req, res);
        return authObj.getCountries();
    });
}