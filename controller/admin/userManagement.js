const _ = require("lodash");

const Controller = require("../base");
const { Users } = require('../../models/s_users');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads')
const { AccessTokens } = require("../../models/s_auth");

const usersListingStages = [
    { $lookup: {from: "kycdetails",localField: "_id",foreignField: "userId",as: "kycdetails"}},
    { $unwind: {"path": "$kycdetails","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "orgdetails",localField: "_id",foreignField: "userId",as: "orgdetails"}},
    { $unwind: {"path": "$orgdetails","preserveNullAndEmptyArrays": true}},
    {$project: {
        fullName: 1,
        dob: 1,
        gender: 1,
        age: 1,
        emailId: 1,
        country: 1,
        mobileNo: 1,
        password: 1,
        transactionPassword: 1,
        sponserId: 1,
        registerId: 1,
        organisationName: 1,
        registerYear: 1,
        termsAndConditions: 1,
        status: 1,
        role: 1,
        shippingAddresses: [address],
        "kycdetails":"$kycdetails",
        "orgdetails":"$orgdetails"
        }}
]

const downloadFilesStages = [
    { $lookup: {from: "kyc",localField: "_id",foreignField: "userId",as: "kycdetails"}},
    { $unwind: {"path": "$kycdetails","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "Country",localField: "countryId",foreignField: "_id",as: "country"}},
    { $unwind: {"path": "$country","preserveNullAndEmptyArrays": true}},
    {$project: {
        "Doj":{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} }, 
        "User ID":"$registerId",
        "User Name": "$fullName",
        "Image": "$image",
        "Sponser ID":"$sponserId",
        "Age": "$age",
        "Gender": "$gender",
        "Mobile Number": "$mobileNo",
        "Email ID": "$emailId",
        "User Type": "$role",
        "Account Status": "$status",
        "KYC status":"$kycdetails.status",
        "Remarks":"$kycdetails.remarks",
        "Country":"$country.name",
        "City":"",
        "State":""
        }}
]

const loginHistoryStages = [
    { $lookup: {from: "Users",localField: "userId",foreignField: "_id",as: "users"}},
    { $unwind: {"path": "$users","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "Admin",localField: "adminId",foreignField: "_id",as: "admins"}},
    { $unwind: {"path": "$admins","preserveNullAndEmptyArrays": true}},
    {$project: {
        "users.fullName": "$users.fullname",
        "users.registerId": "$users.registerId",
        "users._id": "$users._id",
        "users.role": "$users.role",
        ipAddress:1,
        device:1,
        createdAt:1,
        }}
]

const downloadFilesOfLoginHistory = [
    { $lookup: {from: "Users",localField: "userId",foreignField: "_id",as: "users"}},
    { $unwind: {"path": "$users","preserveNullAndEmptyArrays": true} },
    {$project: {
        "Full Name":"$users.fullName",
        "Register ID": "$users.registerId",
        Role: "$users.role",
        "IP Address": "$ipAddress",
        Device: "$device",
        Date:{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} },
        }}
]

const getUserStages = [
    { $lookup: {from: "kycdetails",localField: "_id",foreignField: "userId",as: "kycdetails"}},
    { $unwind: {"path": "$kycdetails","preserveNullAndEmptyArrays": true} },
    { $lookup: {from: "orgdetails",localField: "_id",foreignField: "userId",as: "orgdetails"}},
    { $unwind: {"path": "$orgdetails","preserveNullAndEmptyArrays": true}},
    {$project: {
        fullName: 1,
        dob: 1,
        gender: 1,
        age: 1,
        emailId: 1,
        country: 1,
        mobileNo: 1,
        password: 1,
        transactionPassword: 1,
        sponserId: 1,
        registerId: 1,
        organisationName: 1,
        registerYear: 1,
        termsAndConditions: 1,
        status: 1,
        role: 1,
        shippingAddresses: [address],
        "kycdetails":"$kycdetails",
        "orgdetails":"$orgdetails"
        }}
]


class UserManagementController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
    /********************************************************
    Purpose: users Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"",
        "endDate":"",
    }
    Return: JSON String
    ********************************************************/
    async usersListing() {
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
            const result = await Users.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...usersListingStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Users.count({isDeleted:false})
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

/********************************************************
    Purpose: Get User Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getUserDetails() {
        try {
            const userId = this.req.params.userId;
            if (!userId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const getUser = await Users.aggregate([
                {$match: {_id: ObjectID(userId), isDeleted: false}},
                ...getUserStages
            ])
            if (_.isEmpty(getUser))
                return this.res.send({ status: 0, message: "User details not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: getUser });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
       Purpose: Delete Single And Multiple Users Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "userIds":["5cd01da1371dc7190b085f86"]
       }
       Return: JSON String
       ********************************************************/
       async deleteUsers() {
        try {
            if (!this.req.body.userIds) {
                return this.res.send({ status: 0, message: "Please send userIds" });
            }
            let msg = 'User not deleted.';
            let status = 1;
            const updatedUsers = await Users.updateMany({ _id: { $in: this.req.body.userIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedUsers) {
                msg = updatedUsers.modifiedCount ? updatedUsers.modifiedCount + ' user deleted.' : updatedUsers.matchedCount== 0 ? "Details not found" : msg;
                status = updatedUsers.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
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
            "startDate":"2022-09-16",
            "endDate":"2022-09-16"
            "filteredFields": ["Doj", "User ID"] 
        }
       Return: JSON String
       ********************************************************/
       async downloadUserFiles() {
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
                [ "Doj","User ID" ,"User Name" ,"Image" ,"Sponser ID" ,"Age" ,"Gender" ,"Mobile Number" ,"Email ID" ,"User Type" ,"Account Status" ,"KYC status", "Remarks", "Country", "City", "State"]

            data['model'] = Users;
            data['stages'] = downloadFilesStages;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['fileName'] = 'users'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get login history Details
    Method: POST
    {
        "page":1,
        "pagesize":3,
        "startDate":"",
        "endDate":"",
    }
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async loginHistory() {
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
            const result = await AccessTokens.aggregate([
                {$match: {$and: query, userId: { $exists: true } }},
                ...loginHistoryStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await AccessTokens.count({isDeleted:false})
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Login History Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getLoginHistoryDetailsOfUser() {
        try {
            const loginHistoryId = this.req.params.loginHistoryId;
            if (!loginHistoryId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const loginHistory = await AccessTokens.aggregate([
                {$match: {_id: ObjectID(loginHistoryId), isDeleted: false}},
                ...loginHistoryStages
            ])
            if (_.isEmpty(loginHistory) && loginHistory.length == 0)
                return this.res.send({ status: 0, message: "User details not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: loginHistory });
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
            "startDate":"2022-09-16",
            "endDate":"2022-09-16"
            "filteredFields": ["Full Name", "Register ID", "Role","IP Address", "Device", "Date"]
        }
       Return: JSON String
       ********************************************************/
       async downloadLoginHistoryFiles() {
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
                ["Full Name", "Register ID", "Role","IP Address", "Device", "Date"]

            data['model'] = AccessTokens;
            data['stages'] = downloadFilesOfLoginHistory;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['fileName'] = 'users_login_history'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}
module.exports = UserManagementController;