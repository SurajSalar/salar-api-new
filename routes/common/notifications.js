const NotificationsController = require('../../controller/common/notifications');

module.exports = (router, app) => {
    router.post('/common/getUnreadNotifications', (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.getUnreadNotifications();
    });

    router.post('/common/markNotificationsAsread', (req, res, next) => {
        const notificationObj = (new NotificationsController()).boot(req, res);
        return notificationObj.markNotificationsAsread();
    });

}