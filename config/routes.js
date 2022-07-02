module.exports = (router, app) => {
    require('../routes/user/auth')(router, app)
};