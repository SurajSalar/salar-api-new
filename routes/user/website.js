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
    router.get('/ua/:category/sub-categories', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getSubCategoryiesOfCategoryUA();
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
    router.get('/ua/ecomm-products/:id', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getEcommProductsUAID();
    });
    router.get('/ua/product-detail/:id', (req, res, next) => {
        const websiteObj = (new WebsiteController()).boot(req, res);
        return websiteObj.getEcommProductsDetailUAID();
    });
    

     router.get('/ua/getDealDetailsall', (req, res, next) => {
        const dealObj = (new WebsiteController()).boot(req, res);
        return dealObj.getDealDetailsAll();
    });

    
}