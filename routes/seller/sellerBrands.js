const SellerBrandsController = require('../../controller/seller/sellerBrands');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateSellerBrands', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerBrandsController()).boot(req, res);
        return sellerObj.addAndUpdateSellerBrands();
    });

    router.get('/seller/getSellerBrands/:sellerBrandId', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerBrandsController()).boot(req, res);
        return sellerObj.getSellerBrands();
    });

    router.post('/seller/changeStatusOfSellerBrands', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerBrandsController()).boot(req, res);
        return sellerObj.changeStatusOfSellerBrands();
    });

    router.post('/seller/deleteSellerBrands', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerBrandsController()).boot(req, res);
        return sellerObj.deleteSellerBrands();
    });

    router.post('/seller/sellerBrandsListing', Authorization.isSellerAuthorised, (req, res, next) => {
        const sellerObj = (new SellerBrandsController()).boot(req, res);
        return sellerObj.sellerBrandsListing();
    });
}