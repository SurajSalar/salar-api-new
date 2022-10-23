const OrgDetailsController = require('../../controller/user/organisationDetails');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/addAndUpdateOrgDetails', Authorization.isAuthorised, (req, res, next) => {
        const orgObj = (new OrgDetailsController()).boot(req, res);
        return orgObj.addAndUpdateOrgDetails();
    });

    router.get('/getOrgDetails/:orgId', Authorization.isAuthorised, (req, res, next) => {
        const orgObj = (new OrgDetailsController()).boot(req, res);
        return orgObj.getOrgDetails();
    });

    router.post('/deleteOrgDetails', Authorization.isAuthorised, (req, res, next) => {
        const orgObj = (new OrgDetailsController()).boot(req, res);
        return orgObj.deleteOrgDetails();
    });

    router.get('/getOrgDetailsOfUser', Authorization.isAuthorised, (req, res, next) => {
        const orgObj = (new OrgDetailsController()).boot(req, res);
        return orgObj.getOrgDetailsOfUser();
    });
}
