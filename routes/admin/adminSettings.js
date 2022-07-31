const AdminSettingsController = require('../../controller/admin/adminSettings');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/addUpdateAdminSettings', Authorization.isAdminAuthorised, (req, res, next) => {
        const adminSettingsObj = (new AdminSettingsController()).boot(req, res);
        return adminSettingsObj.addUpdateAdminSettings();
    });

    router.get('/getAdminSettings', Authorization.isAdminAuthorised, (req, res, next) => {
        const adminSettingsObj = (new AdminSettingsController()).boot(req, res);
        return adminSettingsObj.getAdminSettings();
    });
}