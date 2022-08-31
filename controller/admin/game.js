const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const { GameCategory } = require('../../models/s_category_game')
const { Game } = require('../../models/s_games')
const { GameSubCategory } = require('../../models/s_sub_category_game')
const { Plan } = require('../../models/s_plan_game')
const { Game_Product } = require('../../models/s_game_product')
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');
const Model = require("../../utilities/model");

class MlmProductsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }
    async addMlmCategory() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create Category" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "description", "status", "type", "image"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newCategory = await new Model(GameCategory).store(data);
                if (_.isEmpty(newCategory)) {
                    return this.res.send({ status: 0, message: "Game category not saved" })
                }
                return this.res.send({ status: 1, message: "Game category added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, data: error, message: error.message });
        }
    }
    async getMlmCategory() {
        try {
            const categry = await GameCategory.find({ status: true, });
            if (_.isEmpty(categry)) {
                return this.res.send({ status: 0, message: "Game Category not found", data: [] });
            }
            return this.res.send({ status: 1, data: categry, message: "Game Categories" });

        } catch (error) {
            console.error(error)
            return this.res.status(500).send({ status: 0, message: "Internal server error" });
        }
    }

    async addGame() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create game" });
            }
            let data = this.req.body;

            const fieldsArray = ["category_id", "name", "game_url", "status", "image"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.status(400).send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newGame = await new Model(Game).store(data);
                if (_.isEmpty(newGame)) {
                    return this.res.send({ status: 0, message: "Game not saved" })
                }
                return this.res.send({ status: 1, message: "Game added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, data: error, message: error.message });
        }
    }
    async getGames() {
        try {
            const game = await Game.find().populate({ "path": "category_id" });
            if (_.isEmpty(game)) {
                return this.res.send({ status: 0, message: "Game not found", data: [] });
            }
            return this.res.send({ status: 1, data: game, message: "Games" });

        } catch (error) {
            console.error(error)
            return this.res.status(500).send({ status: 0, message: "Internal server error" });
        }
    }
    async getGameById() {
        try {
            const game = await Game.findById(this.req.params.gameId);
            if (_.isEmpty(game)) {
                return this.res.send({ status: 0, message: "Game not found", data: [] });
            }
            return this.res.send({ status: 1, data: game, message: "Games" });

        } catch (error) {
            console.error(error)
            return this.res.status(500).send({ status: 0, message: "Internal server error" });
        }
    }

    async addMlmSubCategory() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ _id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create sub category" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "description", "category", "status", "type", "image"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newSubCategory = await new Model(GameSubCategory).store(data);
                if (_.isEmpty(newSubCategory)) {
                    return this.res.send({ status: 0, message: "Game sub category not saved" })
                }
                return this.res.send({ status: 1, message: "Game sub category added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getMlmSubCategory() {
        try {
            const subcategry = await SubCategory.find({ status: true, });
            if (_.isEmpty(subcategry)) {
                return this.res.send({ status: 0, message: "SubCategory not found" });
            }
            return this.res.send({ status: 1, data: subcategry });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async addMlmPlan() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create plan" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "width", "depth", "status"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newPlan = await new Model(Plan).store(data);
                if (_.isEmpty(newPlan)) {
                    return this.res.send({ status: 0, message: "Game plan not saved" })
                }
                return this.res.send({ status: 1, message: "Game plan added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getMlmPlan() {
        try {
            const plan = await Plan.find({});
            if (_.isEmpty(plan)) {
                return this.res.send({ status: 0, message: "Plan not found" });
            }
            return this.res.send({ status: 1, data: plan });

        } catch (error) {
            console.log(error)
            return this.res.status(500).send({ status: 0, message: "Internal server error" });
        }
    }
    async addMlmGameProduct() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ _id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "plan", "category", "sub_category", "prod_type", "country", "sku", "prod_image", "meta_title", "meta_keywords", "mets_desc", "description", "units", "company_expence", "gst_percent", "gst_amount", "pck_chrgs", "seller_disc", "courier_chr", "gst_trnx_fees", "others_taxes", "points", "auto_points", "commision", "auto_rcycle_comm", "status", "final_price", "auto_rcycle", "points_val_days", "auto_points_val_days", "points_switch"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newGame = await new Model(Game).store(data);
                if (_.isEmpty(newGame)) {
                    return this.res.send({ status: 0, message: "Game not saved" })
                }
                return this.res.send({ status: 1, message: "Game added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getGame() {
        try {
            const game = await Game.find({ status: true, });
            if (_.isEmpty(game)) {
                return this.res.send({ status: 0, message: "Game not found" });
            }
            return this.res.send({ status: 1, data: game });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = MlmProductsController;