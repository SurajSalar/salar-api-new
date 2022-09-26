module.exports = (router, app) => {
    // Admin Routes
    require('../routes/admin/auth')(router, app)
    require('../routes/admin/supportTickets')(router, app)
    require('../routes/common/fileUpload')(router, app)
    require('../routes/admin/adminSettings')(router, app)
    require('../routes/admin/games')(router, app)
    require('../routes/admin/products')(router, app)
    require('../routes/admin/settings')(router, app)
    require('../routes/admin/teamLevels')(router, app)
    require('../routes/admin/teamProducts')(router, app)
    require('../routes/admin/teamBonusSubscriptions')(router, app)
    require('../routes/admin/userManagement')(router, app)
    require('../routes/admin/ticketCategories')(router, app)
    // User Routes
    require('../routes/user/auth')(router, app)
    require('../routes/user/userProfile')(router, app)
    require('../routes/user/kycDetails')(router, app)
    require('../routes/user/orgDetails')(router, app)
    require('../routes/user/bankDetails')(router, app)
    require('../routes/user/orders')(router, app)
    require('../routes/user/website')(router, app)
    // Common Routes
    require('../routes/common/supportTickets')(router, app)
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