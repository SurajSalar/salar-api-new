const _ = require("lodash");

const Controller = require("../base");
const Model = require("../../utilities/model");
const { Category } = require('../../models/s_category')
const { Country } = require("../../models/s_country")
const {Allpages} = require("../../models/s_allpages")
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class AllpagesController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
    }

   async addPages() {
        try {
          let data = this.req.body;
            let fieldsArray =["title","description"];
            let emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                 return this.res.send({ status: 0, message: "not found" });
            }else{
                const neeAllpages = await new Model(Allpages).store(data);
                return this.res.send({ status: 1, message: "registered Successfully"});
            }
        } catch (error) {
            console.log("error = ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }

    }

     async getPages() {
        try {
            const newBlogs = await Allpages.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: newBlogs });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }


    }





}
module.exports = AllpagesController;