const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const { Email } = require('../../models/s_email')
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class EmailSetting extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }

    async updateEmailSetting() {
        try {
            const user = this.req.user;
            const admin = await Admin.findOne({ _id: user })
            if (_.isEmpty(admin)) {
                return this.res.send({ status: 0, message: "User not have permission to edit email" });
            }


            const updateEmail = await Email.findByIdAndUpdate(this.req.params.emailId, this.req.body);
            if (!updateEmailTemplate) {
                return this.res.send({ status: 0, message: "Template not updated" })
            } else {
                return this.res.send({ status: 1, message: "Email template updated successfully" });
            }

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}

module.exports = EmailSetting;