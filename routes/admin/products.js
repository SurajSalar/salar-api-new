const AdminProductController = require('../../controller/admin/product');

module.exports = (router, app) => {
    router.post('/admin-category', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addCategory();
    });
    router.get('/admin-category', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getCategory();
    });

    router.post('/admin-subcategory', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addSubCategory();
    });
    router.get('/admin-subcategory', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getSubCategory();
    });

    router.post('/admin-childcategory', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addChildCategory();
    });
    router.get('/admin-childcategory', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getChildCategory();
    });

    router.post('/admin-brands', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addBrands();
    });
    router.get('/admin-brands', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getBrand();
    });

    router.post('/admin-products', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addEcommProduct();
    });
    router.get('/admin-products', (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getProduct();
    });
}