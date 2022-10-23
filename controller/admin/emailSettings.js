const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const { Email } = require('../../models/s_email')
const { Country } = require('../../models/s_country')
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');
const Model = require("../../utilities/model");

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
            console.error("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    async addCounty() {
        try {

            let data = this.req.body;

            const fieldsArray = ["name", "iso", "status", "nickname"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newCountry = await new Model(Country).store(data);
                if (_.isEmpty(newCountry)) {
                    return this.res.send({ status: 0, message: "country not saved" })
                }
                return this.res.send({ status: 1, message: "country added successfully" });
            }
        } catch (error) {
            console.error("error in add country", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    async getCountries() {
        try {
            const country = await Country.find({ status: true, });
            if (_.isEmpty(country)) {
                return this.res.send({ status: 0, message: "countries not found", data: [] });
            }
            return this.res.send({ status: 1, data: country, message: "countries" });

        } catch (error) {
            console.error(error)
            return this.res.status(500).send({ status: 0, message: "internal server error" });
        }
    }
}

module.exports = EmailSetting;