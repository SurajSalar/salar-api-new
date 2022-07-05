module.exports = (router, app) => {
    // Admin Routes
    require('../routes/admin/auth')(router, app)
    require('../routes/admin/supportTickets')(router, app)
    // User Routes
    require('../routes/user/auth')(router, app)
    require('../routes/user/userProfile')(router, app)
    require('../routes/user/fileUpload')(router, app)
    require('../routes/user/kycDetails')(router, app)
    require('../routes/user/bankDetails')(router, app)
    // Common Routes
    require('../routes/common/supportTickets')(router, app)
};