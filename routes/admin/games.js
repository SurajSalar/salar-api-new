const AdminGameController = require('../../controller/admin/game');

module.exports = (router, app) => {
    router.post('/admin-game-category', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmCategory();
    })
    router.get('/admin-game-category', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getMlmCategory();
    });

    router.post('/admin-game-subcategory', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmSubCategory();
    });
    router.get('/admin-game-subcategory', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getMlmSubCategory();
    });

    router.post('/admin-game-plan', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmPlan();
    });
    router.get('/admin-game-plan', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getMlmPlan();
    });

    router.post('/admin-game', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.addMlmGameProduct();
    });
    router.get('/admin-game', (req, res, next) => {
        const authObj = (new AdminGameController()).boot(req, res);
        return authObj.getGame();
    });
}