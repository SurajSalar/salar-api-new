const SubscriptionsController = require('../../controller/seller/subscriptions');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/seller/addSubscriptions', Authorization.isSellerAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.addSubscriptions();
    });

    router.get('/seller/getSubscriptionDetails/:subscriptionId', Authorization.isSellerAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.getSubscriptionDetails();
    });
    
    router.post('/seller/subscriptionsListing', Authorization.isSellerAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.subscriptionsListing();
    });

    router.post('/seller/downloadSubscriptionFiles', Authorization.isSellerAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.downloadSubscriptionFiles();
    });
}