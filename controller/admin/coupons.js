const _ = require("lodash");

const Controller = require("../base");
const { Coupons } = require('../../models/s_coupons');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads');


class CouponsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

      /********************************************************
        Purpose: Add and update Coupon details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "type": "For Products",
            "userLimit": 5,
            "minShoppingAmount": 100,
            "maxShoppingAmount": 2000,
            "startDate": "2022/10/25",
            "endDate": "2023/10/25",
            "discount": 100,
            "discountType": "Amount"
            "couponId": "" //optional 
        }               
        Return: JSON String
    ********************************************************/
    async addAndUpdateCoupon() {
        try {
            let data = this.req.body;
            const fieldsArray = ["type", "userLimit", "minShoppingAmount", "maxShoppingAmount", "startDate", "endDate", "discount", "discountType" ];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            if(data.couponId){
                await Coupons.findByIdAndUpdate(data.couponId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Coupon details updated successfully" });
            }else{
                data['couponCode'] = await this.commonService.randomGenerator(8,'capital')
                const newCoupon = await new Model(Coupons).store(data);
                if (_.isEmpty(newCoupon)) {
                    return this.res.send({ status: 0, message: "Coupon details not saved" })
                }
                return this.res.send({ status: 1, message: "Coupon details added successfully"});
            }
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Get Coupon Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getCouponDetails() {
        try {
            const data = this.req.params;
            if (!data.couponId) {
                return this.res.send({ status: 0, message: "Please send couponId" });
            }
            const Coupon = await Coupons.findOne({ _id: data.couponId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(Coupon)) {
                return this.res.send({ status: 0, message: "Coupon details not found" });
            }
            return this.res.send({ status: 1, data: Coupon });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple coupons change status
     Parameter:
     {
        "couponIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfCoupons() {
        try {
            let msg = "Coupon status not updated";
            const updatedCoupons = await Coupons.updateMany({ _id: { $in: this.req.body.couponIds } }, { $set: { status: this.req.body.status } });
            if (updatedCoupons) {
                msg = updatedCoupons.modifiedCount ? updatedCoupons.modifiedCount + " coupon updated" : updatedCoupons.matchedCount == 0 ? "Coupon not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Delete Coupon details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "couponIds":["5c9df24382ddca1298d855bb"]
    }  
    Return: JSON String
    ********************************************************/
    async deleteCoupons() {
        try {
            if (!this.req.body.couponIds) {
                return this.res.send({ status: 0, message: "Please send couponIds" });
            }
            let msg = 'Coupon not deleted.';
            let status = 1;
            const updatedCoupons = await Coupons.updateMany({ _id: { $in: this.req.body.couponIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedCoupons) {
                msg = updatedCoupons.modifiedCount ? updatedCoupons.modifiedCount + ' coupon deleted.' : updatedCoupons.matchedCount== 0 ? "Details not found" : msg;
                status = updatedCoupons.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: coupons Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-20",
        "endDate":"2022-10-25",
        "searchText": ""
    }
    Return: JSON String
    ********************************************************/
    async couponsListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
                console.log(`query: ${JSON.stringify(query)}`)
            }
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ couponCode: regex }] })
            }
            const result = await Coupons.aggregate([
                {$match: { isDeleted: false, $and: query}},
                {$project: {createdAt:1, couponCode:1, discountType:1, discount:1, minShoppingAmount:1,
                maxShoppingAmount:1, userLimit:1, startDate:1,endDate:1, status:1}},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Coupons.aggregate([
                {$match: { isDeleted: false, $and: query}},
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
      /********************************************************
       Purpose: Download csv and excel files
       Method: Post
       Authorisation: true
       Parameter:
       {
            "type":"csv" or "excel",
            "startDate":"2022-09-20",
            "endDate":"2022-09-25",
            "searchText": "",
            "filteredFields": [    "Date","Coupon","Type of Discount" ,"Discount","Minimum Shopping Amount","Maximum Shopping Amount","Users Limit","Start Date","End Date","Status"] 
        }
       Return: JSON String
       ********************************************************/
       async downloadCouponFiles() {
        try {
            let data =  this.req.body;
            if (!data.type) {
                return this.res.send({ status: 0, message: "Please send type of the file to download" });
            }
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
                console.log(`query: ${JSON.stringify(query)}`)
            }
            data.filteredFields = data.filteredFields ? data.filteredFields :
                ["Date","Coupon","Type of Discount" ,"Discount","Minimum Shopping Amount","Maximum Shopping Amount","Users Limit","Start Date","End Date","Status"]
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ couponCode: regex }] })
            }
            data['model'] = Coupons;
            data['stages'] = [];
            data['projectData'] = [{$project:{Date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata"} }, Coupon: "$couponCode","Type of Discount" :"$discountType",Discount: "$discount",
             "Minimum Shopping Amount":"$minShoppingAmount","Maximum Shopping Amount":"$maxShoppingAmount", "Users Limit":"$userLimit",
              "Start Date":"$startDate", "End Date":"$endDate", Status: "$status"}}];
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['filterQuery'] = {}
            data['fileName'] = 'coupons'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = CouponsController;