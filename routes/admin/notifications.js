const NotificationsController = require('../../controller/admin/notifications');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/admin/addAndUpdateNotification', Authorization.isAdminAuthorised, (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.addAndUpdateNotification();
    });

    router.get('/admin/getNotificationDetails/:notificationId', Authorization.isAdminAuthorised, (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.getNotificationDetails();
    });

    router.post('/admin/publishNotification', Authorization.isAdminAuthorised, (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.publishNotification();
    });

    router.post('/admin/deleteNotifications', Authorization.isAdminAuthorised, (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.deleteNotifications();
    });

    router.post('/admin/notificationsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.notificationsListing();
    });

    router.post('/admin/downloadNotificationFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.downloadNotificationFiles();
    });
}