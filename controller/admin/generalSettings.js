const _ = require("lodash");
const Controller = require("../base");
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');
const { Country } = require('../../models/s_country');
const { Admin } = require('../../models/s_admin')

class GeneralSettings extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }

    async addCountry() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ _id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to add Country" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "iso", "nickname", "status"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newCountry = await new Model(Country).store(data);
                if (_.isEmpty(newCountry)) {
                    return this.res.send({ status: 0, message: "Country not saved" })
                }
                return this.res.send({ status: 1, message: "Country added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    async getCountry() {
        try {
            const countries = await Country.find({ status: true, });
            if (_.isEmpty(countries)) {
                return this.res.send({ status: 0, message: "Country not found" });
            }
            return this.res.send({ status: 1, data: countries });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}

module.exports = GeneralSettings;