const utilities = require("../utilities");
module.exports = {
  sendRequestedMail: async (req, res) => {
    try {
      let mailStatus = await utilities.sendEmail();
      res.status(200).json(mailStatus);
    } catch (error) {
      console.log(
        "🚀 ~ file: utilities.js ~ line 6 ~ sendRequestedMail: ~ error",
        error
      );
      res.status(500).json(error);
    }
  },
  sendRequestedMessage: async (req, res) => {
    try {
      let mailStatus = await utilities.sendTextMessage(req.body.mobile, req.body.message);
      res.status(200).json(mailStatus);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
