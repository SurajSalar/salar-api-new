const AdminEmailController = require('../../controller/admin/emailSettings');
const AdminEmailTemplateController = require('../../controller/admin/templateSettings');

module.exports = (router, app) => {
    router.put('/email-setting', (req, res, next) => {
        const authObj = (new AdminEmailController()).boot(req, res);
        return authObj.updateEmailSetting();
    });
    router.put('/template-setting', (req, res, next) => {
        const authObj = (new AdminEmailTemplateController()).boot(req, res);
        return authObj.updateEmailTemplate();
    });
}