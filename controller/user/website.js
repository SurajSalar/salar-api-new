const _ = require("lodash");

const Controller = require("../base");
const { Category } = require('../../models/s_category')
const { GameCategory } = require('../../models/s_category_game')
const { SubCategory } = require("../../models/s_sub_category")
const { ChildCategory } = require("../../models/s_child_category")
const { Brand } = require("../../models/s_brand")
const { GameProduct } = require("../../models/s_game_product")
const { Product } = require("../../models/s_product")
const { Country } = require("../../models/s_county")

const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class WebsiteController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
    }

    async getCountriesUA() {
        try {
            const countries = await Country.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: countries });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async getCategoryiesUA() {
        try {
            const categories = await Category.find({ status: true, }, { status: 0, _v: 0 },);
            const gamecategories = await GameCategory.find({ status: true, }, { status: 0, _v: 0 });

            return this.res.send({ status: 1, data: [...categories, ...gamecategories] });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async getSubCategoryiesUA() {
        try {
            const subcategories = await SubCategory.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: subcategories });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async getSubCategoryiesOfCategoryUA() {
        try {
            const subcategories = await SubCategory.find({ status: true, category: this.req.params.category }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: subcategories });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async getChildCategoryiesUA() {
        try {
            const childcategories = await ChildCategory.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: childcategories });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async getBrandsUA() {
        try {
            const brand = await Brand.find({ status: true, }, { status: 0, _v: 0 });
            return this.res.send({ status: 1, data: brand });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async getGameProductsUA() {
        try {
            const gameProduct = await GameProduct.find({ status: 1 }, { status: 0, _v: 0 }).limit(this.req.query.limit || 10).skip(this.req.query.offset || 0);
            return this.res.send({ status: 1, data: gameProduct });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async getEcommProductsUA() {
        try {
            let query = { status: true }
            if (this.req.query.category)
                query['category'] = this.req.query.category

            const products = await Product.find(query, { status: 0, _v: 0 }).limit(this.req.query.limit || 10).skip(this.req.query.offset || 0);
            return this.res.send({ status: 1, data: products });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}

module.exports = WebsiteController;