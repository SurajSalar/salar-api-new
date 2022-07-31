const _ = require("lodash");

const Controller = require("../base");
const Model = require("../../utilities/model");

const { AdminSettings } = require('../../models/s_adminSettings');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class AdminSettingsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
   /********************************************************
    Purpose: AdminSettings insert and update
    Method: Post
    Authorisation: true
    Parameter:
    {
        "local":{
            "minimum":4,
            "maximum":5
        },
        "global":{
            "minimum":4,
            "maximum":5
        },
        "tds":{
            "withPanCard":2,
            "withoutPanCard":5.5
        },
        "withdrawal":2,
        "fundTransfer": 1,
        "purchase":1,
        "proComission":1.5
    }
     Return: JSON String
     ********************************************************/
     async addUpdateAdminSettings() {
        try {
            let fieldsArray = ['local', 'global', 'tds','withdrawal','fundTransfer', 'purchase', 'proCommission'];
            let data = await (new RequestBody()).processRequestBody(this.req.body, fieldsArray);
            const adminSettings = await AdminSettings.findOne();
            if (!_.isEmpty(adminSettings)) {
                const settingsData = await AdminSettings.findByIdAndUpdate(adminSettings._id, data, { new: true });
                if (_.isEmpty(settingsData)) {
                    return this.res.send({ status: 0, message: "Admin Settings is not Updated." })
                }
                return this.res.send({ status: 1, message: "Admin settings updated successfully", data: settingsData })

            } else {
                const settingsData = await (new Model(AdminSettings)).store(data);
                if (_.isEmpty(settingsData)) {
                    return this.res.send({ status: 0, message: "Admin settings is not saved." })
                }
                return this.res.send({ status: 1, message: "Admin Settings saved successfully", data: settingsData });
            }

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: error });
        }
    }
    /********************************************************
     Purpose: getAdminSettings
     Parameter: GET
     Return: JSON String
     ********************************************************/
    async getAdminSettings() {
        try {
            const adminSettings = await AdminSettings.findOne();
            return this.res.send(_.isEmpty(adminSettings) ? { status: 0, message: "Admin Settings not found" } : { status: 1, message: "Admin settings details", data: adminSettings });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: error });
        }
    }
}
module.exports = AdminSettingsController;