const AdvertisementsController = require('../../controller/admin/advertisements');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    
    router.post('/admin/advertisementListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdvertisementsController()).boot(req, res);
        return adObj.advertisementListing();
    });

    router.post('/admin/updateAdvertisementStatusByAdmin', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdvertisementsController()).boot(req, res);
        return adObj.updateAdvertisementStatusByAdmin();
    });
}