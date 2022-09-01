const OrderController = require('../../controller/user/orderManagement.js');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/place-order-game', Authorization.isAuthorised, (req, res, next) => {
        const orderObj = (new OrderController()).boot(req, res);
        return orderObj.placeGameProductOrder();
    });
}