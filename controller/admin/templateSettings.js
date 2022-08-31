const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const { EmailTemplate } = require('../../models/s_email_template')
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class EmailTemplateSetting extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }

    async updateEmailTemplate() {
        try {
            const user = this.req.user;
            const admin = await Admin.findOne({ _id: user })
            if (_.isEmpty(admin)) {
                return this.res.send({ status: 0, message: "User not have permission to edit email template" });
            }


            const updateEmailTemplate = await EmailTemplate.findByIdAndUpdate(this.req.params.templateId, this.req.body);
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

module.exports = EmailTemplateSetting;