const MyStuffController = require('../../controller/user/mystuff.js');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/mystuff/addpoints', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.AddPoints();
    });

    router.get('/mystuff/getpoints/:user_id', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.getPointsByUserId();
    });

    router.post('/mystuff/addrewards', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.AddRewards();
    });

    router.get('/mystuff/getrewards/:user_id', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.getRewardsByUserId();
    });

    router.post('/mystuff/addshoppingamount', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.AddShoppingAmount();
    });

    router.get('/mystuff/getshoppingamount/:user_id', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.getShoppingAmountByUserId();
    });

    router.post('/mystuff/addoffers', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.AddOffers();
    });

    router.get('/mystuff/getoffers/:user_id', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.getOffersByUserId();
    });
    
    router.post('/mystuff/addccdc', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.AddCCDC();
    });

    router.get('/mystuff/getccdc/:user_id', Authorization.isAuthorised, (req, res, next) => {
        const mystuffObj = (new MyStuffController()).boot(req, res);
        return mystuffObj.getCCDCByUserId();
    });
}