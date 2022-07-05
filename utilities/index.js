const nodemailer = require("nodemailer");
const axios = require("axios").default;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  ignoreTLS: false,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
class Services {
  async sendEmail(toEmail, subject, text, html) {
    try {
      
      let sendMail = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      });
      return {
        status: 1,
        message: "email send",
      };
    } catch (error) {
      return { status: 0, message: error.message };
    }
  }
  async sendSignupConfirmation(mobile, message) {
    
    try {
      /*
       *Message should be in below format its signup confirmation templet
       */
      // "Dear  " +
      // request.form["first_name"] +
      // ",Welcome to www.salar.in Your User ID is  " +
      // ref_id +
      // ",Your Password is  " +
      // request.form["password"] +
      // ",Regards Strawberri World Solutions Private Limited.";

      let sendMessage = await axios.get(
        "https://login.bulksmsgateway.in/sendmessage.php" +
          "?user=surajm&password=SurajUk1*&mobile=" +
          mobile +
          "&sender=SRAWPL&message=" +
          message +
          "&type=3&template_id=1207162736766266678",
        {
          params: {
            user: process.env.MESSAGE_USER,
            password: process.env.MESSAGE_PASSWORD,
            mobile: parseInt(mobile),
            sender: process.env.MESSAGE_SENDER,
            message: message,
            type: 3,
            template_id: process.env.MESSAGE_CONF_TEMPLATE_ID,
          },
        }
      );

      return {
        status: 1,
        message: "message send",
      };
    } catch (error) {
      return { status: 0, message: error.message };
    }
  }
 async sendTranxChangeOtp (mobile, message) {
    
    try {
      /*
       *Message should be in below format its Send OTP templet
       */
      //  "Dear User,Your OTP for Password Change is "+user.trnx_otp+",Regards Strawberri World Solutions Private Limited,www.salar.in"

      let sendMessage = await axios.get(
        "https://login.bulksmsgateway.in/sendmessage.php" +
          "?user=surajm&password=SurajUk1*&mobile=" +
          mobile +
          "&sender=SRAWPL&message=" +
          message +
          "&type=3&template_id=1207162736766266678",
        {
          params: {
            user: process.env.MESSAGE_USER,
            password: process.env.MESSAGE_PASSWORD,
            mobile: parseInt(mobile),
            sender: process.env.MESSAGE_SENDER,
            message: message,
            type: 3,
            template_id: process.env.MESSAGE_OTP_TEMPLATE_ID,
          },
        }
      );

      return {
        status: 1,
        message: "message send",
      };
    } catch (error) {
      return { status: 0, message: error.message };
    }
  }

}
module.exports = Services;

