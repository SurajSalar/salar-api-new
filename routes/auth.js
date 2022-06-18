const authController = require('../controller/auth');
module.exports = (router, app) => {
    router.route('/sign-up')
        .post((req, res) => {
            authController.signUp(req, (status, message, data) => {
                res.status(status).json({ message: message, data: data });
            })
        })

    router.route('/login')
        .post((req, res) => {
            console.log("try to login")
            authController.login(req, (status, message, data) => {
                res.status(status).json({ message: message, data: data });
            })
        })

    router.route('/verify-login-otp')
        .post((req, res) => {
            console.log("try to login with otp")
            authController.verifyOTP(req, (status, message, data) => {
                res.status(status).json({ message: message, data: data });
            })
        })
}