let nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // host: 'email-smtp.eu-west-2.amazonaws.com',
  // port: 587,
  // ignoreTLS: false,
  // secure: false,
  // auth: {
  //     user: 'AKIA4X4XBUHCQNQ7YV3K',
  //     pass: 'BDdh7JD4aK5KaOPKVsbrU1TM6u679rbRd3UUS8uzpVp6'
  // }
  host: "smtp.gmail.com",
  port: 465,
  ignoreTLS: false,
  secure: true,
  auth: {
    user: "swspl20@gmail.com",
    pass: "SurajSalar1*",
  },
});

module.exports = {
  sendEmail: async () => {
    try {
      transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
      return {
        status: 1,
        message: "email send",
      };
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 9 ~ signUp: ~ error", error);
      return { status: 1, message: error.message };
    }
  },
};
