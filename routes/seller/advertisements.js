const AdvertisementsController = require('../../controller/seller/advertisements');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addAndUpdateAdvertisement', Authorization.isSellerAuthorised, (req, res, next) => {
        const adObj = (new AdvertisementsController()).boot(req, res);
        return adObj.addAndUpdateAdvertisement();
    });

    router.get('/seller/getAdvertisement/:advertisementId', Authorization.isSellerAuthorised, (req, res, next) => {
        const adObj = (new AdvertisementsController()).boot(req, res);
        return adObj.getAdvertisement();
    });

    router.post('/seller/changeStatusOfAdvertisements', Authorization.isSellerAuthorised, (req, res, next) => {
        const adObj = (new AdvertisementsController()).boot(req, res);
        return adObj.changeStatusOfAdvertisements();
    });

    router.post('/seller/deleteAdvertisements', Authorization.isSellerAuthorised, (req, res, next) => {
        const adObj = (new AdvertisementsController()).boot(req, res);
        return adObj.deleteAdvertisements();
    });

    router.post('/seller/advertisementListing', Authorization.isSellerAuthorised, (req, res, next) => {
        const adObj = (new AdvertisementsController()).boot(req, res);
        return adObj.advertisementListing();
    });
}