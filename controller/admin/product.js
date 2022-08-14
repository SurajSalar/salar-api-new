const _ = require("lodash");

const Controller = require("../base");
const { Admin } = require('../../models/s_admin');
const { Category } = require('../../models/s_category');
const { SubCategory } = require('../../models/s_sub_category')
const { ChildCategory } = require('../../models/s_child_category')
const { Brand } = require('../../models/s_brand')
const { Product } = require('../../models/s_product')
const RequestBody = require("../../utilities/requestBody");
const Authentication = require('../auth');
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class ProductsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
        this.authentication = new Authentication();
    }
    async addCategory() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ _id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create Category" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "description", "status", "type", "image"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newCategory = await new Model(Category).store(data);
                if (_.isEmpty(newCategory)) {
                    return this.res.send({ status: 0, message: "Category not saved" })
                }
                return this.res.send({ status: 1, message: "Category added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getCategory() {
        try {
            const categry = await Category.find({ status: true, });
            if (_.isEmpty(categry)) {
                return this.res.send({ status: 0, message: "Category not found" });
            }
            return this.res.send({ status: 1, data: categry });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async addSubCategory() {
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
                const newSubCategory = await new Model(SubCategory).store(data);
                if (_.isEmpty(newSubCategory)) {
                    return this.res.send({ status: 0, message: "Sub category not saved" })
                }
                return this.res.send({ status: 1, message: "Sub category added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getSubCategory() {
        try {
            const subcategry = await SubCategory.find({ status: true, });
            if (_.isEmpty(subcategry)) {
                return this.res.send({ status: 0, message: "Category not found" });
            }
            return this.res.send({ status: 1, data: subcategry });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async addChildCategory() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ _id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create child category" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "description", "category", "sub_category", "status", "type", "image"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newChildCategory = await new Model(ChildCategory).store(data);
                if (_.isEmpty(newChildCategory)) {
                    return this.res.send({ status: 0, message: " Child category not saved" })
                }
                return this.res.send({ status: 1, message: " Child category added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getChildCategory() {
        try {
            const childcategry = await ChildCategory.find({ status: true, });
            if (_.isEmpty(childcategry)) {
                return this.res.send({ status: 0, message: "Child category not found" });
            }
            return this.res.send({ status: 1, data: childcategry });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async addBrands() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ _id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to create Brands" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "description", "category", "sub_category", "status", "website", "image", "topBrand", "approval_letter"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newBrand = await new Model(Brand).store(data);
                if (_.isEmpty(newBrand)) {
                    return this.res.send({ status: 0, message: " Brand not saved" })
                }
                return this.res.send({ status: 1, message: " Brand added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getBrand() {
        try {
            const brnad = await Brand.find({ status: true, });
            if (_.isEmpty(brnad)) {
                return this.res.send({ status: 0, message: "Brand not found" });
            }
            return this.res.send({ status: 1, data: brnad });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    async addEcommProduct() {
        try {
            const currentUserId = this.req.user;
            const user = await Admin.findOne({ _id: currentUserId })
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User is not allowed to add Product" });
            }
            let data = this.req.body;

            const fieldsArray = ["name", "category", "sub_category", "child_category", "seller", "brand", "prod_image", "gallary_image", "description", "status", "min_purchase_qty", "max_purchase_qty", "seller_type", "sku", "barcode", "unit_price", "commision", "gst_percent", "gst_amount", "final_price", "courier_chr", "pck_chrgs", "handling_chrgs", "sponsor_commission", "discout_point_aplicable", "return_applicable", "cancel_chrgs", "refund_applicable", "refund_amount", "replacement_applicable", "replacement_day", "delivery_location", "shipping_day", "attributes", "stock", "low_stock_warning", "featured_product", "status", "meta_title", "meta_keywords", "mets_desc"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            } else {
                const newProduct = await new Model(Product).store(data);
                if (_.isEmpty(newProduct)) {
                    return this.res.send({ status: 0, message: " Product not saved" })
                }
                return this.res.send({ status: 1, message: " Product added successfully" });
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    async getProduct() {
        try {
            const product = await Product.find({ status: true, });
            if (_.isEmpty(product)) {
                return this.res.send({ status: 0, message: "Product not found" });
            }
            return this.res.send({ status: 1, data: product });

        } catch (error) {
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = ProductsController;