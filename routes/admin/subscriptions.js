const SubscriptionsController = require('../../controller/admin/subscriptions');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/admin/addAndUpdateSubscriptions', Authorization.isAdminAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.addAndUpdateSubscriptions();
    });

    router.get('/admin/getSubscriptionDetails/:subscriptionId', Authorization.isAdminAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.getSubscriptionDetails();
    });

    router.post('/admin/changeStatusOfSubscriptions', Authorization.isAdminAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.changeStatusOfSubscriptions();
    });

    router.post('/admin/deleteSubscriptions', Authorization.isAdminAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.deleteSubscriptions();
    });

    router.post('/admin/subscriptionsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.subscriptionsListing();
    });

    router.post('/admin/downloadSubscriptionFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const subscriptionObj = (new SubscriptionsController()).boot(req, res);
        return subscriptionObj.downloadSubscriptionFiles();
    });
}