const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const { EmailTemplate } = require('../../models/s_email_template')
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class AdminUserController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }

    async getAllUsers() {
        try {
            return this.res.send({ status: 1, message: "all user list" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "internal server error" });
        }
    }
}

module.exports = AdminUserController;