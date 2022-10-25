const CategoriesController = require('../../controller/common/categories');

module.exports = (router, app) => {
    router.post('/common/getCategoriesList', (req, res, next) => {
        const categoryObj = (new CategoriesController()).boot(req, res);
        return categoryObj.getCategoriesList();
    });

    router.post('/common/getSubCategoriesList', (req, res, next) => {
        const categoryObj = (new CategoriesController()).boot(req, res);
        return categoryObj.getSubCategoriesList();
    });

    router.post('/common/getChildCategoriesList', (req, res, next) => {
        const categoryObj = (new CategoriesController()).boot(req, res);
        return categoryObj.getChildCategoriesList();
    });
}