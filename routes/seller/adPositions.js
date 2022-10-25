const AdPositionsController = require('../../controller/seller/adPositions');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/getAdPositionsList', Authorization.isSellerAuthorised, (req, res, next) => {
        const adObj = (new AdPositionsController()).boot(req, res);
        return adObj.getAdPositionsList();
    });
}