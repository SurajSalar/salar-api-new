const CouponsController = require('../../controller/admin/coupons');
const Authorization = require('../../middleware/auth');

module.exports = (router, app) => {
    router.post('/admin/addAndUpdateCoupon', Authorization.isAdminAuthorised, (req, res, next) => {
        const couponObj = (new CouponsController()).boot(req, res);
        return couponObj.addAndUpdateCoupon();
    });

    router.get('/admin/getCouponDetails/:couponId', Authorization.isAdminAuthorised, (req, res, next) => {
        const couponObj = (new CouponsController()).boot(req, res);
        return couponObj.getCouponDetails();
    });

    router.post('/admin/changeStatusOfCoupons', Authorization.isAdminAuthorised, (req, res, next) => {
        const couponObj = (new CouponsController()).boot(req, res);
        return couponObj.changeStatusOfCoupons();
    });

    router.post('/admin/deleteCoupons', Authorization.isAdminAuthorised, (req, res, next) => {
        const couponObj = (new CouponsController()).boot(req, res);
        return couponObj.deleteCoupons();
    });

    router.post('/admin/couponsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const couponObj = (new CouponsController()).boot(req, res);
        return couponObj.couponsListing();
    });

    router.post('/admin/downloadCouponFiles', Authorization.isAdminAuthorised, (req, res, next) => {
        const couponObj = (new CouponsController()).boot(req, res);
        return couponObj.downloadCouponFiles();
    });
}