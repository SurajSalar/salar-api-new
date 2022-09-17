const TeamBonusSubscriptionsController = require('../../controller/admin/teamBonusSubscriptions');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/addAndUpdateTeamBonusSubscriptions', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamBonusObj = (new TeamBonusSubscriptionsController()).boot(req, res);
        return teamBonusObj.addAndUpdateTeamBonusSubscriptions();
    });

    router.get('/getTeamBonusSubscriptionDetails/:teamBonusSubscriptionId', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamBonusObj = (new TeamBonusSubscriptionsController()).boot(req, res);
        return teamBonusObj.getTeamBonusSubscriptionDetails();
    });

    router.post('/teamBonusSubscriptionsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamBonusObj = (new TeamBonusSubscriptionsController()).boot(req, res);
        return teamBonusObj.teamBonusSubscriptionsListing();
    });

    router.post('/deleteTeamBonusSubscriptions', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamBonusObj = (new TeamBonusSubscriptionsController()).boot(req, res);
        return teamBonusObj.deleteTeamBonusSubscriptions();
    });

    router.post('/downloadTeamBonusSubscriptionFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamBonusObj = (new TeamBonusSubscriptionsController()).boot(req, res);
        return teamBonusObj.downloadTeamBonusSubscriptionFiles();
    });

}