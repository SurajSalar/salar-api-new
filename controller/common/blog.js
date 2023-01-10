const _ = require("lodash");

const Controller = require("../base");
const Model = require("../../utilities/model");
const { Category } = require('../../models/s_category')
const { Country } = require("../../models/s_country")
const {Blogs} = require("../../models/s_blog")
const {Authers} = require("../../models/s_auther")
const {Blogarticles} = require("../../models/s_blogarticle")
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class BlogsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
    }

   async addBlogs() {
        try {
          let data = this.req.body;
            let fieldsArray =["image","category"];
            let emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                 return this.res.send({ status: 0, message: "not found" });
            }else{
                const neeBlogs = await new Model(Blogs).store(data);
                return this.res.send({ status: 1, message: "registered Successfully"});
            }
        } catch (error) {
            console.log("error = ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }

    }

     async getBlogs() {
        try {
            const newBlogs = await Blogs.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: newBlogs });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }


    }



 async addAuthers() {
        try {
          let data = this.req.body;
            let fieldsArray =["name","image","gender","qualification","occupation"];
            let emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                 return this.res.send({ status: 0, message: "not found" });
            }else{
                const neeBlogs = await new Model(Authers).store(data);
                return this.res.send({ status: 1, message: "registered Successfully"});
            }
        } catch (error) {
            console.log("error = ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }

    }

     async getAuthers() {
        try {
            const newBlogs = await Authers.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: newBlogs });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }


    }


    async addBlogArticle() {
        try {
          let data = this.req.body;
            let fieldsArray =["blogtitle","description","image","category","auther"];
            let emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                 return this.res.send({ status: 0, message: "not found" });
            }else{
                const neeBlogs = await new Model(Blogarticles).store(data);
                return this.res.send({ status: 1, message: "registered Successfully"});
            }
        } catch (error) {
            console.log("error = ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }

    }

     async getBlogArticle() {
        try {
            const newBlogs = await Blogarticles.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: newBlogs });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }


    }


}
module.exports = BlogsController;