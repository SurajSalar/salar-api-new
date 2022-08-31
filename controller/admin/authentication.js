const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class AdminAuthController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }
    async signIn() {
        try {
            let fieldsArray = [];
            const data = this.req.body;

            if (data.grant_type == "password") {
                fieldsArray = ["email", "password", "grant_type"];
                const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                }


                const admin = await Admin.findOne({ email: data.email.toString().toLowerCase() });
                if (_.isEmpty(admin)) {
                    return this.res.status(401).send({ status: 0, message: "Invalid Email" });
                }

                const status = await this.commonService.verifyPassword({ password: data.password, savedPassword: admin.password });
                if (!status) {
                    return this.res.status(401).send({ status: 0, message: "Invalid password" });
                }

                const adminDetails = await Admin.findById({ _id: admin._id }).select({ password: 0, __v: 0, transactionPassword: 0 });
                const { token, refreshToken } = await this.authentication.createToken({ id: admin._id, role: adminDetails.role });
                return this.res.send({ status: 1, message: "Login Successful", access_token: token, refresh_token: refreshToken, data: adminDetails });
            } else if (data.grant_type == "refresh_token") {
                fieldsArray = ["refreshToken", "grant_type"];
                const emptyFieldsRefresh = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFieldsRefresh && Array.isArray(emptyFieldsRefresh) && emptyFieldsRefresh.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFieldsRefresh.toString() + " fields required." });
                }
                const tokenStatus = await this.authentication.verfyRefreshToken(data);
                const adminDetails = await Admin.findById({ _id: tokenStatus.id }).select({ password: 0, __v: 0 });
                const { token, refreshToken } = await this.authentication.createToken({ id: adminDetails._id, role: adminDetails.role });
                return this.res.send({ status: 1, message: "Login Successful", access_token: token, refresh_token: refreshToken, data: adminDetails });
            } else {
                return this.res.status(400).send({ status: 0, message: "Please send grant type fields required." });
            }

        } catch (error) {
            console.log(error);
            return this.res.status(500).send({ status: 0, message: "Internal server error" });
        }
    }
}

module.exports = AdminAuthController;