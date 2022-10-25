const AdPositionsController = require('../../controller/admin/adPositions');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/admin/addAndUpdateAdPosition', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdPositionsController()).boot(req, res);
        return adObj.addAndUpdateAdPosition();
    });

    router.get('/admin/getAdPosition/:adPositionId', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdPositionsController()).boot(req, res);
        return adObj.getAdPosition();
    });

    router.post('/admin/changeStatusOfAdPositions', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdPositionsController()).boot(req, res);
        return adObj.changeStatusOfAdPositions();
    });

    router.post('/admin/deleteAdPositions', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdPositionsController()).boot(req, res);
        return adObj.deleteAdPositions();
    });

    router.post('/admin/adPositionsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdPositionsController()).boot(req, res);
        return adObj.adPositionsListing();
    });

    router.post('/admin/downloadAdPositionsFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const adObj = (new AdPositionsController()).boot(req, res);
        return adObj.downloadAdPositionsFiles();
    });
}