const ManageApprovalsController = require('../../controller/admin/manageApprovals');
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {

    router.post('/admin/updateEtdStatusByAdmin', Authorization.isAdminAuthorised, (req, res, next) => {
        const approvalObj = (new ManageApprovalsController()).boot(req, res);
        return approvalObj.updateEtdStatusByAdmin();
    });

    router.post('/admin/updateStoreStatusByAdmin', Authorization.isAdminAuthorised, (req, res, next) => {
        const approvalObj = (new ManageApprovalsController()).boot(req, res);
        return approvalObj.updateStoreStatusByAdmin();
    });

    router.post('/admin/storesListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const approvalObj = (new ManageApprovalsController()).boot(req, res);
        return approvalObj.storesListing();
    });

    router.post('/admin/updateSellerBrandStatusByAdmin', Authorization.isAdminAuthorised, (req, res, next) => {
        const approvalObj = (new ManageApprovalsController()).boot(req, res);
        return approvalObj.updateSellerBrandStatusByAdmin();
    });

    router.post('/admin/sellerBrandsListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const approvalObj = (new ManageApprovalsController()).boot(req, res);
        return approvalObj.sellerBrandsListing();
    });

    router.post('/admin/updateSellerCategoriesStatusByAdmin', Authorization.isAdminAuthorised, (req, res, next) => {
        const approvalObj = (new ManageApprovalsController()).boot(req, res);
        return approvalObj.updateSellerCategoriesStatusByAdmin();
    });

    router.post('/admin/sellerCategoriesListing', Authorization.isAdminAuthorised, (req, res, next) => {
        const approvalObj = (new ManageApprovalsController()).boot(req, res);
        return approvalObj.sellerCategoriesListing();
    });

}