const OrderController = require('../../controller/user/order.js');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/add-to-cart', Authorization.isAuthorised, (req, res, next) => {
        const orderObj = (new OrderController()).boot(req, res);
        return orderObj.addToCart();
    });
    router.get('/cart', Authorization.isAuthorised, (req, res, next) => {
        const orderObj = (new OrderController()).boot(req, res);
        return orderObj.getCart();
    });
    router.post('/place-order', Authorization.isAuthorised, (req, res, next) => {
        const orderObj = (new OrderController()).boot(req, res);
        return orderObj.placeOrder();
    });
    router.get('/order-summary', Authorization.isAuthorised, (req, res, next) => {
        const orderObj = (new OrderController()).boot(req, res);
        return orderObj.getOrderSummary();
    });
    router.get('/orders', Authorization.isAuthorised, (req, res, next) => {
        const orderObj = (new OrderController()).boot(req, res);
        return orderObj.getAllOrder();
    });
}