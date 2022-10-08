const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { Stores } = require('../../models/s_store');
const { Sellers } = require('../../models/s_sellers');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads');


const storesListingStages = [
     { $lookup: {from: "countries",localField: "storeAddress.countryId",foreignField: "_id",as: "country"}},
     { $unwind: {"path": "$country","preserveNullAndEmptyArrays": true}},
     {$project: {
         _id:1, createdAt:1, registerId:1, name:1,logo:1,banner:1,mobileNo:1,whatsappNo:1,emailId:1,storeAddress:1, status:1, approvalStatus:1, country:1
         }}
 ]

class StoresController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

      /********************************************************
        Purpose: Add and update Store details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "name": "SRS Stores",
            "logo": "logo.png",
            "banner": "banner.png",
            "mobileNo": "7207334583",
            "whatsappNo": "7207334583",
            "emailId": "lakshmimattafreelancer@gmail.com",
            "storeAddress": {
                "addressLine1":"addressLine1",
                "addressLine2":"addressLine2",
                "countryId":"630f516684310d4d2a98baf2",
                "city":"Rajahmundry",
                "state":"Andhra Pradesh",
                "pincode":533287
            }
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateStore() {
                try {
                    const currentSellerId = this.req.user;
                    let data = this.req.body;
                    data.sellerId = currentSellerId;
                    const fieldsArray = ["name","logo","banner","mobileNo","whatsappNo","emailId","storeAddress"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const seller = await Sellers.findOne({_id: currentSellerId},{_id:1})
                    if (_.isEmpty(seller)) {
                        return this.res.send({ status: 0, message: "Seller not found"});
                    }
                    if(data.storeId){
                        // const getStore = await Stores.findOne({sellerId: currentSellerId,name: data.name,_id: {$ne: data.storeId}, isDeleted: false})
                        // if (!_.isEmpty(getStore)) {
                        //     return this.res.send({ status: 0, message: "Store name already exists" })
                        // }
                        await Stores.findByIdAndUpdate(data.storeId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Store details updated successfully" });
                    }else{
                        const getStore = await Stores.findOne({sellerId: currentSellerId, isDeleted: false})
                        // const getStore = await Stores.findOne({sellerId: currentSellerId,name: data.name, isDeleted: false})
                        if (!_.isEmpty(getStore)) {
                            return this.res.send({ status: 0, message: "Store details exists" })
                        }
                        let sellersCount = await Sellers.count();
                        if(sellersCount <= 8){
                            sellersCount = '0'+ (sellersCount+1);
                        }
                        const randomText = (await this.commonService.randomGenerator(2,'number') +await this.commonService.randomGenerator(1,'capital')+await this.commonService.randomGenerator(2,'number') )
                        data['registerId'] = 'ST'+randomText+ sellersCount
                        const newStore = await new Model(Stores).store(data);
                        if (_.isEmpty(newStore)) {
                            return this.res.send({ status: 0, message: "Store details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Store details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Store Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getStore() {
        try {
            const data = this.req.params;
            if (!data.storeId) {
                return this.res.send({ status: 0, message: "Please send storeId" });
            }
            const Store = await Stores.findOne({ sellerId: this.req.user, _id: data.storeId, isDeleted: false }, { _v: 0 }).populate('storeAddress.countryId',{ name: 1, iso: 1, nickname: 1 });
            if (_.isEmpty(Store)) {
                return this.res.send({ status: 0, message: "Store details not found" });
            }
            return this.res.send({ status: 1, data: Store });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple store change status
     Parameter:
     {
        "storeIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfStores() {
        try {
            let msg = "Store status not updated";
            const updatedStores = await Stores.updateMany({ _id: { $in: this.req.body.storeIds } }, { $set: { status: this.req.body.status } });
            console.log("updatedStores",updatedStores)
            if (updatedStores) {
                msg = updatedStores.modifiedCount ? updatedStores.modifiedCount + " store updated" : updatedStores.matchedCount == 0 ? "Store not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Delete Store details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "storeIds":["5c9df24382ddca1298d855bb"]
    }  
    Return: JSON String
    ********************************************************/
    async deleteStores() {
        try {
            if (!this.req.body.storeIds) {
                return this.res.send({ status: 0, message: "Please send storeIds" });
            }
            let msg = 'Store not deleted.';
            let status = 1;
            const updatedStores = await Stores.updateMany({ _id: { $in: this.req.body.storeIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedStores) {
                msg = updatedStores.modifiedCount ? updatedStores.modifiedCount + ' store deleted.' : updatedStores.matchedCount== 0 ? "Details not found" : msg;
                status = updatedStores.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: stores Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-20",
        "endDate":"2022-09-25",
        "filter": {
            "status": true,
            "approvalStatus": "Approved",
            "country.name":"India"
        },
        "searchText": "",
    }
    Return: JSON String
    ********************************************************/
    async storesListing() {
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
                query.push({ $or: [{ name: regex }, {mobileNo: regex}, {whatsappNo: regex}, {emailId: regex}] })
            }
            const filterQuery = data.filter ? data.filter: {}
            const result = await Stores.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...storesListingStages,
                {$match: filterQuery},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Stores.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...storesListingStages,
                {$match: filterQuery},
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = StoresController;