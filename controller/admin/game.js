const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class MlmProductsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }


}
module.exports = MlmProductsController;