const TeamLevelsController = require('../../controller/admin/teamLevels');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/addAndUpdateTeamLevel', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamLevelObj = (new TeamLevelsController()).boot(req, res);
        return teamLevelObj.addAndUpdateTeamLevel();
    });

    router.post('/teamLevelsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamLevelObj = (new TeamLevelsController()).boot(req, res);
        return teamLevelObj.teamLevelsListing();
    });

    router.get('/getTeamLevelDetails/:teamLevelId', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamLevelObj = (new TeamLevelsController()).boot(req, res);
        return teamLevelObj.getTeamLevelDetails();
    });

    router.post('/changeStatusOfTeamLevels', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamLevelObj = (new TeamLevelsController()).boot(req, res);
        return teamLevelObj.changeStatusOfTeamLevels();
    });

    router.post('/deleteTeamLevels', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamLevelObj = (new TeamLevelsController()).boot(req, res);
        return teamLevelObj.deleteTeamLevels();
    });

}