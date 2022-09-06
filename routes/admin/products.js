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

    router.post('/gst-govt-code', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addGstGovtCode();
    });
    router.get('/gst-govt-codes', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getGstGovtCode();
    });

    router.post('/attribute-unit', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addAttributeUnit();
    });
    router.get('/attribute-units', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getAttributeUnits();
    });

    router.post('/admin-attribute', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.addProductAttribute();
    });
    router.get('/admin-attributes', Authorization.isAdminAuthorised, (req, res, next) => {
        const authObj = (new AdminProductController()).boot(req, res);
        return authObj.getProductAttribute();
    });
}