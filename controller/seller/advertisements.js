const _ = require("lodash");

const Controller = require("../base");
const { Advertisements } = require('../../models/s_advertisements');
const { AdPositions } = require('../../models/s_ad_positions');
const { Stores } = require('../../models/s_store');
const { Sellers } = require('../../models/s_sellers');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


const lookupStages = [
    { $lookup: {from: "sellers",localField: "sellerId",foreignField: "_id",as: "seller"}},
    { $unwind: {"path": "$seller","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "stores",localField: "storeId",foreignField: "_id",as: "store"}},
    { $unwind: {"path": "$store","preserveNullAndEmptyArrays": true}},
    { $lookup: {from: "ad_positions",localField: "positionId",foreignField: "_id",as: "adPosition"}},
    { $unwind: {"path": "$adPosition","preserveNullAndEmptyArrays": true}},
 ]

const advertisementListingStages = [
    ...lookupStages,
     {$project: {
         _id:1, createdAt:1, registerId:1, title:1, file:1, categoryPage: 1, productPage:1, position:1,
         sliderNo:1, seller:1, store:1, pageLink:1, startDate:1, endDate:1, status:1, updatedAt:1, approvalStatus:1, reason:1
         }}
 ]

class AdvertisementsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }

      /********************************************************
        Purpose: Add and update Advertisement details
        Method: Post
        Authorisation: true
        Parameter:
        {
                "positionId":"634153228eabe8707a33c2fa",
                "categoryPage": "http://google.com", 
                "productPage": "http://google.com", 
                "userPortal":"Dashboard", 
                "sliderNo": 1, 
                "title": "Title", 
                "sellerId": "632ee49ab72f0cc5f1c91852", 
                "storeId": "6341048f8f131bf23bfff5b7", 
                "pageLink": "http://google.com", 
                "file": "avatar.jpg", 
                "startDate": "2022/09/25", 
                "endDate": "2022/10/25",
                "advertisementId": "" //optional 
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateAdvertisement() {
                try {
                    let data = this.req.body;
                    const fieldsArray = ["positionId","categoryPage" ,"productPage" ,"userPortal" ,"sliderNo" ,"title" ,"sellerId" ,"storeId" ,"pageLink" ,"file" ,"startDate" ,"endDate" ];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const store = await Stores.findOne({_id: data.storeId, isDeleted: false},{_id:1})
                    if (_.isEmpty(store)) {
                        return this.res.send({ status: 0, message: "Store not found"});
                    }
                    const seller = await Sellers.findOne({_id: data.sellerId, isDeleted: false},{_id:1})
                    if (_.isEmpty(seller)) {
                        return this.res.send({ status: 0, message: "Seller not found"});
                    }
                    const adPosition = await AdPositions.findOne({_id: data.positionId, isDeleted: false},{_id:1})
                    if (_.isEmpty(adPosition)) {
                        return this.res.send({ status: 0, message: "AdPosition not found"});
                    }
                    if(data.advertisementId){
                        await Advertisements.findByIdAndUpdate(data.advertisementId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Advertisement details updated successfully" });
                    }else{
                        let count = await Advertisements.count();
                        if(count <= 8){
                            count = '0'+ (count+1);
                        }
                        const randomText = (await this.commonService.randomGenerator(2,'number') +await this.commonService.randomGenerator(1,'capital')+await this.commonService.randomGenerator(2,'number') )
                        data['registerId'] = 'Ad'+randomText+ count
                        const newAdvertisement = await new Model(Advertisements).store(data);
                        if (_.isEmpty(newAdvertisement)) {
                            return this.res.send({ status: 0, message: "Advertisement details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Advertisement details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Advertisement Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getAdvertisement() {
        try {
            const data = this.req.params;
            if (!data.advertisementId) {
                return this.res.send({ status: 0, message: "Please send advertisementId" });
            }
            const Advertisement = await Advertisements.findOne({ _id: data.advertisementId, isDeleted: false }, { _v: 0 }).populate('sellerId',{ fullName: 1, registerId:1, _id:1}).populate('storeId',{ name: 1, registerId:1, _id:1}).populate('positionId',{ position: 1, _id:1});
            if (_.isEmpty(Advertisement)) {
                return this.res.send({ status: 0, message: "Advertisement details not found" });
            }
            return this.res.send({ status: 1, data: Advertisement });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple advertisement change status
     Parameter:
     {
        "advertisementIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfAdvertisements() {
        try {
            let msg = "Advertisement status not updated";
            const updatedAdvertisements = await Advertisements.updateMany({ _id: { $in: this.req.body.advertisementIds } }, { $set: { status: this.req.body.status } });
            console.log("updatedAdvertisements",updatedAdvertisements)
            if (updatedAdvertisements) {
                msg = updatedAdvertisements.modifiedCount ? updatedAdvertisements.modifiedCount + " advertisement updated" : updatedAdvertisements.matchedCount == 0 ? "Advertisement not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

     /********************************************************
    Purpose: Delete Advertisement details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "advertisementIds":["5c9df24382ddca1298d855bb"]
    }  
    Return: JSON String
    ********************************************************/
    async deleteAdvertisements() {
        try {
            if (!this.req.body.advertisementIds) {
                return this.res.send({ status: 0, message: "Please send advertisementIds" });
            }
            let msg = 'Advertisement not deleted.';
            let status = 1;
            const updatedAdvertisements = await Advertisements.updateMany({ _id: { $in: this.req.body.advertisementIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedAdvertisements) {
                msg = updatedAdvertisements.modifiedCount ? updatedAdvertisements.modifiedCount + ' advertisement deleted.' : updatedAdvertisements.matchedCount== 0 ? "Details not found" : msg;
                status = updatedAdvertisements.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

  /********************************************************
    Purpose: advertisement Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3
    }
    Return: JSON String
    ********************************************************/
    async advertisementListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize;
            const result = await Advertisements.aggregate([
                {$match: { isDeleted: false}},
                ...advertisementListingStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Advertisements.aggregate([
                {$match: { isDeleted: false}},
                ...advertisementListingStages,
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = AdvertisementsController;