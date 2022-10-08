const SellerCategoriesController = require('../../controller/seller/sellerCategories');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateSellerCategories', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerCategoriesController()).boot(req, res);
        return sellerObj.addAndUpdateSellerCategories();
    });

    router.get('/seller/getSellerCategories/:sellerCategoryId', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerCategoriesController()).boot(req, res);
        return sellerObj.getSellerCategories();
    });

    router.post('/seller/changeStatusOfSellerCategories', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerCategoriesController()).boot(req, res);
        return sellerObj.changeStatusOfSellerCategories();
    });

    router.post('/seller/deleteSellerCategories', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerCategoriesController()).boot(req, res);
        return sellerObj.deleteSellerCategories();
    });

    router.post('/seller/sellerCategoriesListing', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerCategoriesController()).boot(req, res);
        return sellerObj.sellerCategoriesListing();
    });
}