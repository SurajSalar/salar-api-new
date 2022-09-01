const AdminProductController = require('../../controller/admin/product');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/admin-category', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addCategory();
    });
    router.get('/admin-category', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getCategory();
    });

    router.post('/admin-subcategory', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addSubCategory();
    });
    router.get('/admin-subcategory', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getSubCategory();
    });

    router.post('/admin-childcategory', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addChildCategory();
    });
    router.get('/admin-childcategory', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getChildCategory();
    });

    router.post('/admin-brands', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addBrands();
    });
    router.get('/admin-brands', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getBrand();
    });

    router.post('/admin-products', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addEcommProduct();
    });
    router.get('/admin-products', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getProduct();
    });
}