const MlmAllController = require('../../controller/user/mlm.js');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/mlm/adduser', Authorization.isAuthorised, (req, res, next) => {
        const paymentObj = (new MlmAllController()).boot(req, res);
        return paymentObj.AddUser();
    });

    router.post('/mlm/rootUser', Authorization.isAuthorised, (req, res, next) => {
        const paymentObj = (new MlmAllController()).boot(req, res);
        return paymentObj.AddRootUser();
    });

    router.get('/getmlmuser', Authorization.isAuthorised, (req, res, next) => {
        const paymentObj = (new MlmAllController()).boot(req, res);
        return paymentObj.getMlmUser();
    });
}