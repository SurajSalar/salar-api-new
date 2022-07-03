module.exports = (router, app) => {
    require('../routes/user/auth')(router, app)
    require('../routes/user/userProfile')(router, app)
    require('../routes/user/fileUpload')(router, app)
    require('../routes/user/kycDetails')(router, app)
    require('../routes/user/bankDetails')(router, app)
};