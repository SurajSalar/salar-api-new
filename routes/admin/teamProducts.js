const TeamProductsController = require('../../controller/admin/teamProducts');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/addAndUpdateTeamProduct', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamProductObj = (new TeamProductsController()).boot(req, res);
        return teamProductObj.addAndUpdateTeamProduct();
    });

    router.get('/getTeamProductDetails/:teamProductId', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamProductObj = (new TeamProductsController()).boot(req, res);
        return teamProductObj.getTeamProductDetails();
    });

    router.post('/teamProductsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamProductObj = (new TeamProductsController()).boot(req, res);
        return teamProductObj.teamProductsListing();
    });

    router.post('/deleteTeamProducts', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamProductObj = (new TeamProductsController()).boot(req, res);
        return teamProductObj.deleteTeamProducts();
    });

    router.post('/downloadFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const teamProductObj = (new TeamProductsController()).boot(req, res);
        return teamProductObj.downloadFiles();
    });

}