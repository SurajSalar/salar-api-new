module.exports = (router, app) => {
    // Admin Routes
    require('../routes/admin/auth')(router, app)
    // User Routes
    require('../routes/user/auth')(router, app)
    require('../routes/user/userProfile')(router, app)
    require('../routes/user/fileUpload')(router, app)
    require('../routes/user/kycDetails')(router, app)
    require('../routes/user/bankDetails')(router, app)
    // Seller Routes
    require('../routes/seller/auth')(router, app)
    require('../routes/seller/sellerProfile')(router, app)
    require('../routes/seller/kycDetails')(router, app)
    require('../routes/seller/bankDetails')(router, app)
    require('../routes/seller/etdDetails')(router, app)
    require('../routes/seller/fssaiDetails')(router, app)
    require('../routes/seller/signatureDetails')(router, app)
    require('../routes/seller/iecDetails')(router, app)
};