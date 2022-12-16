const PaymentsController = require('../../controller/user/payments.js');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
    router.post('/callback', Authorization.isAuthorised, (req, res, next) => {
        const paymentObj = (new PaymentsController()).boot(req, res);
        return paymentObj.PaymentSuccess();
    });

    router.post('/getAllPayments', Authorization.isAuthorised, (req, res, next) => {
        const paymentObj = (new PaymentsController()).boot(req, res);
        return paymentObj.getAllPayments();
    });
}