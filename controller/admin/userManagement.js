const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { Users } = require('../../models/s_users');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const DownloadsController = require('../common/downloads');
const { AccessTokens } = require("../../models/s_auth");
const { Tickets } = require("../../models/s_ticket");
const { KycDetails } = require("../../models/s_kyc");
const { OrgDetails } = require("../../models/s_organisation");

const kycStages = [
    {
        "$lookup" : {
            "from" : "kycs",
            "let" : {
                "userId" : "$_id"
            },
            "pipeline" : [
                {
                    "$match" : {
                        "$expr" : {
                            "$and" : [
                                {
                                    "$eq" : [
                                        "$isDeleted",
                                        false
                                    ]
                                },
                                {
                                    "$eq" : [
                                        "$userId",
                                        "$$userId"
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            "as" : "kycdetails"
        }
    }, 
    { $unwind: {"path": "$kycdetails","preserveNullAndEmptyArrays": true} },
]

const orgStages = [
    {
        "$lookup" : {
            "from" : "orgdetails",
            "let" : {
                "userId" : "$_id"
            },
            "pipeline" : [
                {
                    "$match" : {
                        "$expr" : {
                            "$and" : [
                                {
                                    "$eq" : [
                                        "$isDeleted",
                                        false
                                    ]
                                },
                                {
                                    "$eq" : [
                                        "$userId",
                                        "$$userId"
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            "as" : "orgdetails"
        }
    }, 
    {
        "$unwind" : {
            "path" : "$orgdetails",
            "preserveNullAndEmptyArrays" : true
        }
    },
]

const bankStages = [
    {
        "$lookup" : {
            "from" : "bankdetails",
            "let" : {
                "userId" : "$_id"
            },
            "pipeline" : [
                {
                    "$match" : {
                        "$expr" : {
                            "$and" : [
                                {
                                    "$eq" : [
                                        "$isDeleted",
                                        false
                                    ]
                                },
                                {
                                    "$eq" : [
                                        "$userId",
                                        "$$userId"
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            "as" : "bankdetails"
        }
    }, 
    {
        "$unwind" : {
            "path" : "$bankdetails",
            "preserveNullAndEmptyArrays" : true
        }
    }, 
]

const sponserStages = [
    {
        "$lookup" : {
            "from" : "users",
            "let" : {
                "sponserId" : "$sponserId"
            },
            "pipeline" : [
                {
                    "$match" : {
                        "$expr" : {
                            "$and" : [
                                {
                                    "$eq" : [
                                        "$isDeleted",
                                        false
                                    ]
                                },
                                {
                                    "$eq" : [
                                        "$registerId",
                                        "$$sponserId"
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            "as" : "sponser"
        }
    }, 
    { $unwind: {"path": "$sponser","preserveNullAndEmptyArrays": true} },
]

const usersListingStages = [
   ...kycStages,
    { $lookup: {from: "countries",localField: "countryId",foreignField: "_id",as: "country"}},
    { $unwind: {"path": "$country","preserveNullAndEmptyArrays": true}},
    {$project: {
        _id:1, createdAt:1, registerId:1, fullName:1, image:1, sponserId:1, age:1, gender:1, mobileNo:1, emailId:1, role:1, status:1,
        kycDetails:"$kycdetails", country:1
        }}
]

const downloadFilesStages = [
   ...kycStages,
    { $lookup: {from: "countries",localField: "countryId",foreignField: "_id",as: "country"}},
    { $unwind: {"path": "$country","preserveNullAndEmptyArrays": true}},
]
const downloadFilesStagesProjection = [
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
        "Country":"$country.name"
        }}
]
const getUserStages = [
    ...kycStages,
    ...orgStages,
    ...bankStages,
    {
        "$lookup" : {
            "from" : "countries",
            "localField" : "countryId",
            "foreignField" : "_id",
            "as" : "country"
        }
    }, 
    {
        "$unwind" : {
            "path" : "$country",
            "preserveNullAndEmptyArrays" : true
        }
    }, 
    {
        "$unwind" : {
            "path" : "$shippingAddresses",
            "preserveNullAndEmptyArrays" : true
        }
    }, 
    {
        "$lookup" : {
            "from" : "countries",
            "localField" : "shippingAddresses.countryId",
            "foreignField" : "_id",
            "as" : "shippingCountry"
        }
    }, 
    {
        "$unwind" : {
            "path" : "$shippingCountry",
            "preserveNullAndEmptyArrays" : true
        }
    }, 
    {
        "$project" : {
            "_id" : 1.0,
            "fullName" : 1.0,
            "dob" : 1.0,
            "gender" : 1.0,
            "age" : 1.0,
            "emailId" : 1.0,
            "country.name" : "$country.name",
            "country.iso" : "$country.iso",
            "country.nickname" : "$country.nickname",
            "country._id" : "$country._id",
            "mobileNo" : 1.0,
            "sponserId" : 1.0,
            "registerId" : 1.0,
            "organisationName" : 1.0,
            "registerYear" : 1.0,
            "termsAndConditions" : 1.0,
            "status" : 1.0,
            "role" : 1.0,
            "shippingAddresses.name" : "$shippingAddresses.name",
            "shippingAddresses.addressLine1" : "$shippingAddresses.addressLine1",
            "shippingAddresses.addressLine2" : "$shippingAddresses.addressLine2",
            "shippingAddresses.city" : "$shippingAddresses.city",
            "shippingAddresses.zipCode" : "$shippingAddresses.zipCode",
            "shippingAddresses.mobileNo" : "$shippingAddresses.mobileNo",
            "shippingAddresses.emailId" : "$shippingAddresses.emailId",
            "shippingAddresses.GST" : "$shippingAddresses.GST",
            "shippingAddresses.defaultAddress" : "$shippingAddresses.defaultAddress",
            "shippingAddresses._id" : "$shippingAddresses._id",
            "shippingAddresses.country.name" : "$shippingCountry.name",
            "shippingAddresses.country.iso" : "$shippingCountry.iso",
            "shippingAddresses.country.nickname" : "$shippingCountry.nickname",
            "shippingAddresses.country._id" : "$shippingCountry._id",
            "kycDetails" : "$kycdetails",
            "orgDetails" : "$orgdetails",
            "bankDetails" : "$bankdetails",
        }
    }, 
    {
        "$group" : {
            "_id" : "$_id",
            "fullName" : {
                "$first" : "$fullName"
            },
            "dob" : {
                "$first" : "$dob"
            },
            "gender" : {
                "$first" : "$gender"
            },
            "age" : {
                "$first" : "$age"
            },
            "emailId" : {
                "$first" : "$emailId"
            },
            "country" : {
                "$first" : "$country"
            },
            "mobileNo" : {
                "$first" : "$mobileNo"
            },
            "sponserId" : {
                "$first" : "$sponserId"
            },
            "registerId" : {
                "$first" : "$registerId"
            },
            "organisationName" : {
                "$first" : "$organisationName"
            },
            "registerYear" : {
                "$first" : "$registerYear"
            },
            "termsAndConditions" : {
                "$first" : "$termsAndConditions"
            },
            "status" : {
                "$first" : "$status"
            },
            "role" : {
                "$first" : "$role"
            },
            "shippingAddresses" : {
                "$push" : {
                    "name" : "$shippingAddresses.name",
                    "addressLine1" : "$shippingAddresses.addressLine1",
                    "addressLine2" : "$shippingAddresses.addressLine2",
                    "city" : "$shippingAddresses.city",
                    "zipCode" : "$shippingAddresses.zipCode",
                    "mobileNo" : "$shippingAddresses.mobileNo",
                    "emailId" : "$shippingAddresses.emailId",
                    "GST" : "$shippingAddresses.GST",
                    "defaultAddress" : "$shippingAddresses.defaultAddress",
                    "_id" : "$shippingAddresses._id",
                    "country" : "$shippingAddresses.country"
                }
            },
            "kycDetails" : {
                "$first" : "$kycDetails"
            },
            "orgDetails" : {
                "$first" : "$orgDetails"
            },
            "bankDetails" : {
                "$first" : "$bankDetails"
            },
        }
    }
]

const kycUsersListingStages = [
    ...kycStages,
    ...bankStages,
     { $lookup: {from: "countries",localField: "countryId",foreignField: "_id",as: "country"}},
     { $unwind: {"path": "$country","preserveNullAndEmptyArrays": true}},
     {$project: {
         _id:1, createdAt:1, role:1,registerId:1, fullName:1, status:1,
         kycDetails:"$kycdetails", country:1, bankDetails: "$bankdetails"
         }}
 ]

const getKycDetailsStages = [
    ...kycStages,
    ...orgStages,
    ...bankStages,
    ...sponserStages,
    {
        "$project" : {
            "_id" : 1.0,
            "fullName" : 1.0,
            "createdAt":1,
            "gender" : 1.0,
            "age" : 1.0,
            "emailId" : 1.0,
            "mobileNo" : 1.0,
            "sponser._id" : "$sponser._id",
            "sponser.fullName" : "$sponser.fullName",
            "sponser.registerId" : "$sponser.registerId",
            "kycDetails": "$kycdetails",
            "orgDetails": "$orgdetails",
            "bankDetails": "$bankdetails"
        }
    }
]


const downloadKycFilesStages = [
    ...kycStages,
    ...bankStages,
    ...orgStages,
     { $lookup: {from: "countries",localField: "countryId",foreignField: "_id",as: "country"}},
     { $unwind: {"path": "$country","preserveNullAndEmptyArrays": true}},
 ]

const downloadKycFilesStagesProjection = [
    {$project: {
        "Doj":{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} }, 
        "User Type": "$role",
        "User ID":"$registerId",
        "User Name": "$fullName",
        "Account Status": "$status",
        "KYC Doc No":"$kycdetails.numberProof",
        "KYC Front Image":"$kycdetails.frontImage",
        "KYC Back Image":"$kycdetails.backImage",
        "KYC Status":"$kycdetails.status",
        "KYC Remarks":"$kycdetails.remarks",
        "KYC Document Name": "$kycdetails.selectId",
        "Country":"$country.name",
        "Bank Name":"$bankdetails.bankName",
        "Account No":"$bankdetails.accountNumber",
        "Account Type":"$bankdetails.accountType",
        "IFSC Code":"$bankdetails.IFSCCode",
        "IBAN Number":"$bankdetails.IBANNumber",
        "Swift Code":"$bankdetails.swiftCode",
        "Branch Name":"$bankdetails.branchName",
        "Pan Card":"$bankdetails.panCard",
        "Organisation Name":"$orgdetails.organisationName",
        "Organisation Certificate Number":"$orgdetails.organisationCertificateNumber",
        "Organisation Role":"$orgdetails.roleInOrganisation",
        "Organisation Front Image":"$orgdetails.orgFrontImage",
        "Organisation Back Image":"$orgdetails.orgBackImage",
        "Organisation Status":"$orgdetails.status",
        "Organisation Remarks":"$orgdetails.remarks",
    }}
]


const loginHistoryStages = [
    { $lookup: {from: "users",localField: "userId",foreignField: "_id",as: "users"}},
    { $unwind: {"path": "$users","preserveNullAndEmptyArrays": true} },
    {$project: {
        "users.fullName": "$users.fullName",
        "users.registerId": "$users.registerId",
        "users._id": "$users._id",
        "users.role": "$users.role",
        "users.status": "$users.status",
        ipAddress: 1,
        device: 1,
        createdAt: 1,
        updatedAt: 1
        }}
]

const downloadFilesOfLoginHistory = [
    { $lookup: {from: "users",localField: "userId",foreignField: "_id",as: "users"}},
    { $unwind: {"path": "$users","preserveNullAndEmptyArrays": true} },
]

const downloadFilesOfLoginHistoryProjection = [
    {$project: {
        "User Name":"$users.fullName",
        "User ID": "$users.registerId",
        Role: "$users.role",
        Status: "$users.status",
        "IP Address": "$ipAddress",
        Device: "$device",
        "Logged In Time":{ $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: "Asia/Kolkata"} },
        "Logged Out Time":{ $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$updatedAt", timezone: "Asia/Kolkata"} }
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
        "startDate":"2022-09-20",
        "endDate":"2022-09-25",
        "filter": {
            "status": true,
            "kycDetails.status": "Approved",
            "country.name":"India"
        },
        "searchText": "",
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
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ fullName: regex }, {registerId: regex}, {mobileNo: regex}, {emailId: regex}] })
            }
            const filterQuery = data.filter ? data.filter: {}
            const result = await Users.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...usersListingStages,
                {$match: filterQuery},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Users.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...usersListingStages,
                {$match: filterQuery},
                {$project: {_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
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
            const tickets = await Tickets.find({isDeleted:false, userId: userId});
            const getUser = await Users.aggregate([
                {$match: {_id: ObjectID(userId), isDeleted: false}},
                ...getUserStages
            ])
            if (_.isEmpty(getUser) && getUser.length == 0)
                return this.res.send({ status: 0, message: "User details not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: {userDetails: getUser[0], tickets,} });
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
            "startDate":"2022-09-20",
            "endDate":"2022-09-25",
            "filter": {
                "status": true,
                "kycDetails.status": "Approved",
                "country.name":"India"
            },
            "searchText": "",
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
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ fullName: regex }, {registerId: regex}, {mobileNo: regex}, {emailId: regex}] })
            }
            data.filteredFields = data.filteredFields ? data.filteredFields :
                [ "Doj","User ID" ,"User Name" ,"Image" ,"Sponser ID" ,"Age" ,"Gender" ,"Mobile Number" ,"Email ID" ,"User Type" ,"Account Status" ,"KYC status", "Remarks", "Country"]

            data['model'] = Users;
            data['stages'] = downloadFilesStages;
            data['projectData'] = downloadFilesStagesProjection;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['filterQuery'] = data.filter ? data.filter: {}
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
        "startDate":"2022-09-24",
        "endDate":"2022-09-25",
        "searchText":""
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
            let searchQuery = [{}]
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                searchQuery.push({ $or: [{ "users.fullName": regex }, {"users.registerId": regex}] })
            }
            const result = await AccessTokens.aggregate([
                {$match: {$and: query, userId: { $exists: true } }},
                ...loginHistoryStages,
                {$match :{$and: searchQuery}},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await AccessTokens.aggregate([
                {$match: {$and: query, userId: { $exists: true } }},
                ...loginHistoryStages,
                {$match :{$and: searchQuery}},
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
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
                {$match: {_id: ObjectID(loginHistoryId)}},
                ...loginHistoryStages
            ])
            if (_.isEmpty(loginHistory) && loginHistory.length == 0)
                return this.res.send({ status: 0, message: "User details not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: loginHistory[0] });
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
            "endDate":"2022-09-16",
            "searchText":"",
            "filteredFields": ["Full Name", "Register ID", "Role","IP Address", "Device",  "Logged In Time", "Logged Out Time"]
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
            let searchQuery = [{}]
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                searchQuery.push({ $or: [{ "users.fullName": regex }, {"users.registerId": regex}] })
            }
            data.filteredFields = data.filteredFields ? data.filteredFields :
                ["User Name", "User ID", "Role", "Status","IP Address", "Device",  "Logged In Time", "Logged Out Time"]

            data['model'] = AccessTokens;
            data['stages'] = downloadFilesOfLoginHistory;
            data['projectData'] = downloadFilesOfLoginHistoryProjection;
            data['key'] = 'createdAt';
            data['query'] = {$and: query,  userId: { $exists: true } };
            data['filterQuery'] = {$and: searchQuery}
            data['fileName'] = 'users_login_history'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Kyc users Listing In Admin
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
            "kycDetails.status": "Approved",
            "country.name":"India"
        },
        "searchText":""
    }
    Return: JSON String
    ********************************************************/
    async kycUsersListing() {
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
                query.push({ $or: [{ fullName: regex }, {registerId: regex}, {mobileNo: regex}, {emailId: regex}] })
            }
            const filterQuery = data.filter ? data.filter: {}
            const result = await Users.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...kycUsersListingStages,
                {$match: filterQuery},
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await Users.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...kycUsersListingStages,
                {$match: filterQuery},
                {$project:{_id:1}}
            ])
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total.length});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Kyc of User Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getKycUserDetails() {
        try {
            const userId = this.req.params.userId;
            if (!userId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const getUser = await Users.aggregate([
                {$match: {_id: ObjectID(userId), isDeleted: false}},
                ...getKycDetailsStages
            ])
            if (_.isEmpty(getUser) && getUser.length == 0)
                return this.res.send({ status: 0, message: "User details not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: getUser[0] });
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
            "endDate":"2022-09-16",
            "filter": {
                "status": true,
                "kycDetails.status": "Approved",
                "country.name":"India"
            },
            "searchText": "",
            "filteredFields": ["Doj", "User ID"] 
        }
       Return: JSON String
       ********************************************************/
       async downloadKycUserFiles() {
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
            if(data.searchText){
                let regex = { $regex: `.*${this.req.body.searchText}.*`, $options: 'i' };
                query.push({ $or: [{ fullName: regex }, {registerId: regex}, {mobileNo: regex}, {emailId: regex}] })
            }
            data.filteredFields = data.filteredFields ? data.filteredFields :
                [ "Doj","User Type", "User ID","User Name","Account Status", "KYC Doc No", "KYC Document Name", "KYC Front Image","KYC Back Image","KYC Status","KYC Remarks","Country","Bank Name","Account No","Account Type","IFSC Code","IBAN Number","Swift Code","Branch Name","Pan Card","Organisation Name","Organisation Certificate Number","Organisation Role","Organisation Front Image","Organisation Back Image","Organisation Status","Organisation Remarks"]

            data['model'] = Users;
            data['stages'] = downloadKycFilesStages;
            data['projectData'] = downloadKycFilesStagesProjection;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['filterQuery'] =  data.filter ? data.filter: {};
            data['fileName'] = 'users-kyc'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
    /********************************************************
        Purpose: Update kyc details by admin
        Method: Post
        Authorisation: true
        Parameter:
        {
            "status": "Rejected",
            "remarks": "Reason for rejection",
            "kycId":""
        }               
        Return: JSON String
    ********************************************************/
    async updateKycStatusByAdmin() {
        try {
            const data = this.req.body;
            const fieldsArray = data.status == "Rejected"? ["status", "remarks", "kycId"] : ["status", "kycId"];
            const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
            if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
            }
            const kyc = await KycDetails.findOne({_id: data.kycId, isDeleted: false});
            if (_.isEmpty(kyc))
                return this.res.send({ status: 0, message: "Kyc details not found" });
            await KycDetails.findByIdAndUpdate(data.kycId, data, { new: true, upsert: true });
            return this.res.send({ status: 1, message: "Kyc details updated successfully" });
        }
        catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
        Purpose: Update org details by admin
        Method: Post
        Authorisation: true
        Parameter:
        {
            "status": "Rejected",
            "remarks": "Reason for rejection"
            "orgId":"",
        }               
        Return: JSON String
    ********************************************************/
        async updateOrgStatusByAdmin() {
            try {
                const data = this.req.body;
                const fieldsArray = data.status == "Rejected"? ["status", "remarks", "orgId"] : ["status", "orgId"];
                const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                    return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                }
                const org = await OrgDetails.findOne({_id: data.orgId, isDeleted: false});
                if (_.isEmpty(org))
                    return this.res.send({ status: 0, message: "Organisation details not found" });
                await OrgDetails.findByIdAndUpdate(data.orgId, data, { new: true, upsert: true });
                return this.res.send({ status: 1, message: "Organisation details updated successfully" });
            }
            catch (error) {
                console.log("error- ", error);
                this.res.send({ status: 0, message: error });
            }
        }
}
module.exports = UserManagementController;