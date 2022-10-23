const AdminGeneralSettingController = require('../../controller/admin/generalSettings');
const isAuthorised = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/country', (req, res, next) => {
        const authObj = (new AdminGeneralSettingController()).boot(req, res);
        return authObj.addCountry();
    });
    router.get('/counties', (req, res, next) => {
        const authObj = (new AdminGeneralSettingController()).boot(req, res);
        return authObj.getCountry();
    });
}