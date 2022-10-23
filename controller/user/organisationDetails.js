const _ = require("lodash");
const { ObjectID } = require('mongodb');

const Controller = require("../base");
const { OrgDetails } = require('../../models/s_organisation');
const { Users } = require('../../models/s_users');
const Model = require("../../utilities/model");
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");


class OrgDetailsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }


      /********************************************************
        Purpose: Add and update org details
        Method: Post
        Authorisation: true
        Parameter:
        {
            "organisationName": "Salar",
            "roleInOrganisation": "Manager",
            "organisationCertificateNumber": "ASDFERWSDSDFSRWES",
            "orgFrontImage": "aadhar.png",
            "orgBackImage": "aadhar.png",
            "orgId":"",
            "transactionPassword":""
        }               
        Return: JSON String
    ********************************************************/
        async addAndUpdateOrgDetails() {
                try {
                    const currentUserId = this.req.user;
                    let data = this.req.body;
                    data.userId = currentUserId;
                    const fieldsArray = ["orgFrontImage", "orgBackImage","organisationName","roleInOrganisation","organisationCertificateNumber","transactionPassword"];
                    const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
                    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
                        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
                    }
                    const user = await Users.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
                    if (_.isEmpty(user)) {
                        return this.res.send({ status: 0, message: "User not found"});
                    }
                    if(data.orgId){
                        await OrgDetails.findByIdAndUpdate(data.orgId, data, { new: true, upsert: true });
                        return this.res.send({ status: 1, message: "Organisation details updated successfully" });
                    }else{
                        const getOrg = await OrgDetails.findOne({userId: currentUserId, isDeleted: false})
                        if (!_.isEmpty(getOrg)) {
                            return this.res.send({ status: 0, message: "Organisation details exists" })
                        }
                        const newOrg = await new Model(OrgDetails).store(data);
                        if (_.isEmpty(newOrg)) {
                            return this.res.send({ status: 0, message: "Organisation details not saved" })
                        }
                        return this.res.send({ status: 1, message: "Organisation details added successfully"});
                    }
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
        }

     /********************************************************
    Purpose: Get Org Details
    Method: GET
    Authorisation: true            
    Return: JSON String
    ********************************************************/
    async getOrgDetails() {
        try {
            const data = this.req.params;
            if (!data.orgId) {
                return this.res.send({ status: 0, message: "Please send orgId" });
            }
            const Org = await OrgDetails.findOne({ _id: data.orgId, isDeleted: false }, { _v: 0 });
            if (_.isEmpty(Org)) {
                return this.res.send({ status: 0, message: "Organisation details not found" });
            }
            return this.res.send({ status: 1, data: Org });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

     /********************************************************
    Purpose: Delete Org details
    Method: Post
    Authorisation: true
    Parameter:
    {
        "orgId":"5c9df24382ddca1298d855bb",
        "transactionPassword":""
    }  
    Return: JSON String
    ********************************************************/
    async deleteOrgDetails() {
        try {
            const data = this.req.body;
            if (!data.orgId || !data.transactionPassword) {
                return this.res.send({ status: 0, message: "Please send orgId and transactionPassword" });
            }
            const user = await Users.findOne({_id: this.req.user, transactionPassword: data.transactionPassword},{_id:1})
            if (_.isEmpty(user)) {
                return this.res.send({ status: 0, message: "User not found"});
            }
            await OrgDetails.findByIdAndUpdate({ _id: ObjectID(data.orgId) },{isDeleted: true}, {new:true, upsert:true})
            return this.res.send({ status: 1, message: "Organisation details deleted successfully" });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Org Details Of User
    Method: Get
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getOrgDetailsOfUser() {
        try {
            const currentUserId = this.req.user;
            if (currentUserId) {
                let getOrgDetails = await OrgDetails.find({ userId: currentUserId, isDeleted: false }, { __v: 0 });
                if (getOrgDetails.length == 0) {
                    return this.res.send({ status: 0, message: "No Organisation details available"});
                }
                return this.res.send({ status: 1, message: "Details are: ", data: getOrgDetails });
            }
            return this.res.send({ status: 0, message: "User not found"});

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }
}
module.exports = OrgDetailsController;