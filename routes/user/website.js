const WebsiteController = require('../../controller/user/website');

module.exports = (router, app) => {
    router.get('/ua/countries', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getCountriesUA();
    });

    router.get('/ua/categories', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getCategoryiesUA();
    });
    router.get('/ua/sub-categories', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getSubCategoryiesUA();
    });
    router.get('/ua/child-categories', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getChildCategoryiesUA();
    });
    router.get('/ua/brands', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getBrandsUA();
    });

    router.get('/ua/game-products', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getGameProductsUA();
    });

    router.get('/ua/ecomm-products', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getEcommProductsUA();
    });
}