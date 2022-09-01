const Controller = require("../base");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");

class OrderManagement extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

    async placeGameProductOrder() {
        try {
            this.res.send({ status: 1, message: "Order Placed" });
        } catch (error) {
            console.error("error in placing game product order ", error);
            this.res.status(500).send({ status: 0, message: error.message, data: error });
        }
    }
}

module.exports = OrderManagement;