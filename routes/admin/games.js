const AdminGameController = require('../../controller/admin/game');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/admin-game-category', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmCategory();
    })
    router.get('/admin-game-category', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getMlmCategory();
    });

    router.post('/admin-add-game', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addGame();
    });
    router.get('/admin-games', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getGames();
    });
    router.get('/admin-game/:gameId', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getGameById();
    });


    router.post('/admin-game-subcategory', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmSubCategory();
    });
    router.get('/admin-game-subcategory', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getMlmSubCategory();
    });

    router.post('/admin-game-plan', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmPlan();
    });
    router.get('/admin-game-plan', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getMlmPlan();
    });

    router.post('/admin-game', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmGameProduct();
    });
    router.get('/admin-games-products', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getGameProducts();
    });
}