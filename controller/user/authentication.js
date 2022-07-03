const _ = require("lodash");

const Controller = require("../base");
const { Users } = require('../../models/s_users');
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const Services = require('../../utilities/index');



class UsersController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }


    /********************************************************
   Purpose: user signUp
   Parameter:
      {
          "fullName":"lakshmi",
          "dob":"29-09-1996",
          "gender":"female",
          "age":"25",
          "emailId":"lakshmimattafreelancer@gmail.com",
          "country":"India",
          "mobileNo":"7207334583",
          "password":"Text@123",
          "sponserId":"",
          "termsAndConditions": true,
          "role": "individual"
      }
      OR
      {
        "organisationName":"Salar",
        "registeredYear":"2016",
        "emailId":"lakshmimattafreelancer@gmail.com",
        "country":"India",
        "mobileNo":"7207334583",
        "password":"Tt@123",
        "sponserId":"",
        "termsAndConditions": true,
        "role": "organisation"
      }
   Return: JSON String
   ********************************************************/
    async signUp() {
        try {
            if(!this.req.body.role){
                return this.res.send({ status: 0, message: "Please send role of the user" });
            }
            let fieldsArray = this.req.body.role == 'individual' ? 
            ["fullName","dob","gender","age","emailId","country","mobileNo","password","termsAndConditions"]:
            ["organisationName","registeredYear","emailId","country","mobileNo","password","termsAndConditions"];
            let emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send"+ " " + emptyFields.toString() + " fields required." });
            }
            if(this.req.body.fullName){
                const validateName = await this.commonService.nameValidation(this.req.body.fullName);
                if(!validateName){
                    return this.res.send({ status: 0, message: "Please send proper fullName" });
                }
            }
            const validateEmail = await this.commonService.emailIdValidation(this.req.body.emailId);
            if(!validateEmail){
                return this.res.send({ status: 0, message: "Please send proper emailId" });
            }
            const validateMobileNo = await this.commonService.mobileNoValidation(this.req.body.mobileNo);
            if(!validateMobileNo){
                return this.res.send({ status: 0, message: "Mobile number should have 10 digits" });
            }
            const validatePassword = await this.commonService.passwordValidation(this.req.body.password);
            if(!validatePassword){
                return this.res.send({ status: 0, message: "Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character" });
            }
            // check emailId is exist or not
            const userMobileNoCount = await Users.count({"mobileNo": this.req.body.mobileNo});
            if(userMobileNoCount >=10){
                return this.res.send({ status: 0, message: "This mobile number exceeds the limit of registeration, please use other mobile for registration" });
            }
            const user = await Users.findOne({"emailId": this.req.body.emailId.toLowerCase()});

            //if user exist give error
            if (!_.isEmpty(user) && user.emailId) {
                return this.res.send({ status: 0, message: "Email already exists" });
            } else {
                let data = this.req.body;
                const transactionPassword = await this.commonService.randomTextGenerator(12);
                const encryptedPassword = await this.commonService.ecryptPassword({ password: data['password'] });
                data = { ...data, password: encryptedPassword, transactionPassword };
                data['emailId'] = data['emailId'].toLowerCase();
                let usersCount = await Users.count();
                if(usersCount <= 8){
                    usersCount = '0'+ (usersCount+1);
                }
                const randomText = await this.commonService.randomTextGenerator(8)
                data['registerId'] = 'S'+randomText+ usersCount
                // save new user
                const newUser = await new Model(Users).store(data);

                // if empty not save user details and give error message.
                if (_.isEmpty(newUser)) {
                    return this.res.send({ status: 0, message: "User not saved" })
                }
                else {
                    const name = newUser.role == 'individual' ? newUser.fullName: newUser.organisationName
                    // Sending email
                    await this.services.sendEmail(newUser.emailId, "Salar", '',`<html><body><h2>HI! ${name} you have successfully registered with salar</h2><strong>RegisteredId</strong>: ${newUser.registerId} </br> <strong>Transaction password:</strong> ${transactionPassword}<h3></h3></body></html>`)
                    const message = `Dear ${name}, Welcome to www.salar.in Your User ID is ${newUser.registerId}, Your Password is ${transactionPassword}, Regards Strawberri World Solutions Private Limited.";`
                    // Sending message
                    if(newUser.country == 'India' && newUser.mobileNo){
                        await this.services.sendSignupConfirmation(newUser.mobileNo, message)
                    }
                    return this.res.send({ status: 1, message: "User registered Successfully"});
                }

            }
        } catch (error) {
            console.log("error = ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }

    }
 
    /********************************************************
    Purpose: SignIn
    Parameter:
        {
            "userId":"emailId" or registerId
            "password":"123456"
        }
    Return: JSON String
   ********************************************************/
    async signIn() {
        try {
            const fieldsArray = ["userId", "password"];
            const data = this.req.body;
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const user = await Users.findOne({$or:[{emailId: data.userId.toString().toLowerCase()},{registerId: data.userId}] , isDeleted: false, status:true });
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User not exists or deleted" });
            }
           
            const status = await this.commonService.verifyPassword({ password: data.password, savedPassword: user.password });
            if (!status) {
                return this.res.send({ status: 0, message: "Invalid password" });
            }

            const userDetails = await Users.findById({_id:user._id}).select({password:0, __v:0, transactionPassword:0});
            const { token } = await this.authentication.createToken({ id: user._id, role: userDetails.role });
            return this.res.send({ status: 1, message: "Login Successful", access_token: token, data: userDetails });
        } catch (error) {
            console.log(error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Forgot password mail
    Parameter:
        {
            "userId":"emailId" or registerId
        }
    Return: JSON String
   ********************************************************/
    async forgotPassword() {
        try {
            const data = this.req.body;
            if(!data.userId){
                return this.res.send({ status: 0, message: "Please send userId" });
            }
            const user = await Users.findOne({$or:[{emailId: data.userId.toString().toLowerCase()},{registerId: data.userId}] , isDeleted: false, status:true });
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User not exists or deleted" });
            }
           
            const token = await this.authentication.generateToken();
            await Users.findByIdAndUpdate(user._id, { forgotToken: token, forgotTokenCreationTime: new Date() });

            const name = user.role == 'individual' ? user.fullName: user.organisationName
            // Sending email
            await this.services.sendEmail(user.emailId, "Salar", '',`<html><body><h2>HI! ${name} you have requested for a password change</h2><h3>Please click on the <a href="www.salar.in/forgotToken=${token}">link</a> to change your password</h3><strong>RegisteredId</strong>: ${user.registerId} </br> <strong>Transaction password:</strong> ${user.transactionPassword}<h3></h3></body></html>`)
            const message = `Dear ${name}, Welcome to www.salar.in Your User ID is ${user.registerId}, Your Password is ${user.transactionPassword}, Regards Strawberri World Solutions Private Limited.";`
            // Sending message
            if(user.country == 'India' && user.mobileNo){
                await this.services.sendSignupConfirmation(user.mobileNo, message)
            }
            return this.res.send({ status: 1, message: "Please check your registered email" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

      /********************************************************
    Purpose: Reset password
    Parameter:
        {
            "password":"123456",
            "token": "errrrwqqqsssfdfvfgfdewwwww"
        }
    Return: JSON String
   ********************************************************/
    async resetPassword() {
        try {
            const user = await Users.findOne({ forgotToken: this.req.body.token });
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "Invalid token"});
            }
            const validatePassword = await this.commonService.passwordValidation(this.req.body.password);
            if(!validatePassword){
                return this.res.send({ status: 0, message: "Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character" });
            }
            let password = await this.commonService.ecryptPassword({ password: this.req.body.password });

            const updateUser = await Users.findByIdAndUpdate(user._id, { password: password }, { new: true });
            if (_.isEmpty(updateUser)) {
                return this.res.send({ status: 0, message: "Password not updated" });
            }
            return this.res.send({ status: 1, message: "Password updated successfully"});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}
module.exports = UsersController;