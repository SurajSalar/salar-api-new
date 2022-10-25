const StoresController = require('../../controller/seller/storeDetails');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateStore', Authorization.isSellerAuthorised, (req, res, next) => {
        const storeObj = (new StoresController()).boot(req, res);
        return storeObj.addAndUpdateStore();
    });

    router.get('/seller/getStore/:storeId', Authorization.isSellerAuthorised, (req, res, next) => {
        const storeObj = (new StoresController()).boot(req, res);
        return storeObj.getStore();
    });

    router.post('/seller/changeStatusOfStores', Authorization.isSellerAuthorised, (req, res, next) => {
        const storeObj = (new StoresController()).boot(req, res);
        return storeObj.changeStatusOfStores();
    });

    router.post('/seller/deleteStores', Authorization.isSellerAuthorised, (req, res, next) => {
        const storeObj = (new StoresController()).boot(req, res);
        return storeObj.deleteStores();
    });

    router.post('/seller/storesListing', Authorization.isSellerAuthorised, (req, res, next) => {
        const storeObj = (new StoresController()).boot(req, res);
        return storeObj.storesListing();
    });
}