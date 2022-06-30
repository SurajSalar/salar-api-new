const utilitiesController = require('../controller/utilities')
module.exports = (router, app) => {
  router.route("/send-email").post((req, res) => {
    utilitiesController.sendRequestedMail(req, res);
  })

  router.route("/send-message").post((req, res) => {
    utilitiesController.sendRequestedMessage(req, res);
  })
};
