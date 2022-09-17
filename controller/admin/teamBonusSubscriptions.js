const _ = require("lodash");

const Controller = require("../base");
const { TeamBonusSubscriptions } = require('../../models/s_team_bonus_subscriptions');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");
const DownloadsController = require('../common/downloads')


const listingStages = [{
	$project: {
		name: 1,
		type: 1,
		price: 1,
		GSTPercentage: 1,
		GSTAmount: {
			$multiply: [{
				$divide: ["$GSTPercentage", 100]
			}, "$price"]
		},
		finalPrice: {
			$subtract: ["$price", {
				$multiply: [{
					$divide: ["$GSTPercentage", 100]
				}, "$price"]
			}]
		},
		points: 1,
		pointsValidity: 1,
		code: 1,
		createdAt: 1
	}
}]
const downloadFilesStages = [{
	$project: {
		Name: "$name",
		Type: "$type",
		Price: "$price",
		GSTPercentage: "$GSTPercentage",
		GSTAmount: {
			$multiply: [{
				$divide: ["$GSTPercentage", 100]
			}, "$price"]
		},
		"Final Price": {
			$subtract: ["$price", {
				$multiply: [{
					$divide: ["$GSTPercentage", 100]
				}, "$price"]
			}]
		},
		Points: "$points",
		"Points Validity":  { $dateToString: { format: "%Y-%m-%d", date: "$pointsValidity"} },
		Code: "$code",
		Date:  { $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} }
	}
}]


class TeamBonusSubscriptionsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
    /********************************************************
   Purpose: Create and Update Team Bonus Subscriptions
   Method: Post
   Authorisation: true
   Parameter:
      {
            name: "Premium",
            type: "1 month",
            GSTPercentage: 10,
            price: 500,
            points: 50,
            pointsValidity: "2022-09-31",
            code: "START",
            teamBonusSubscriptionId:"" //optional
      }
   Return: JSON String
   ********************************************************/
   async addAndUpdateTeamBonusSubscriptions() {
    try {
        let data = this.req.body;
        const fieldsArray = ["name","type","GSTPercentage","price", "points","pointsValidity", "code"]
        const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
        if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
            return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
        }
        data.pointsValidity = new Date(data.pointsValidity);
        if(data.teamBonusSubscriptionId){
            const teamBonus = await TeamBonusSubscriptions.findOne({_id: data.teamBonusSubscriptionId, isDeleted: false})
            if (_.isEmpty(teamBonus)) {
                return this.res.send({ status: 0, message: "Details are not found" });
            }
            const checkTeamBonusName = await TeamBonusSubscriptions.findOne({name: data.name, isDeleted: false, _id: {$nin: [data.teamBonusSubscriptionId]}})
            if (!_.isEmpty(checkTeamBonusName)) {
                return this.res.send({ status: 0, message: `${data.name} already exists` });
            }
            const updatedTeamBonusSubscription = await TeamBonusSubscriptions.findOneAndUpdate({_id: data.teamBonusSubscriptionId},data,{upsert:true, new:true})
            if (_.isEmpty(updatedTeamBonusSubscription)) {
                return this.res.send({ status: 0, message: "Details are not updated" });
            }
            return this.res.send({ status: 1, message: "Team Bonus Subscription details updated successfully", data: updatedTeamBonusSubscription });
       
        }else{
            const teamBonus = await TeamBonusSubscriptions.findOne({name: data.name, isDeleted: false})
            if (!_.isEmpty(teamBonus)) {
                return this.res.send({ status: 0, message: `${data.name} already exists` });
            }
            const newTeamBonusSubscription = await new Model(TeamBonusSubscriptions).store(data);
            if (_.isEmpty(newTeamBonusSubscription)) {
                return this.res.send({ status: 0, message: "Details not saved" });
            }
            return this.res.send({ status: 1, message: "Team Bonus Subscription details created successfully", data: newTeamBonusSubscription });
        }
    } catch (error) {
        console.log("error- ", error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
}

  /********************************************************
    Purpose: Get Team Bonus Subscriptions Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getTeamBonusSubscriptionDetails() {
        try {
            if (!this.req.params.teamBonusSubscriptionId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const teamBonusSubscription = await TeamBonusSubscriptions.findOne({ _id: this.req.params.teamBonusSubscriptionId, isDeleted:false }, { __v: 0 });
            if (_.isEmpty(teamBonusSubscription))
                return this.res.send({ status: 0, message: "Team Bonus Subscription not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: teamBonusSubscription });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Team Bonus Subscriptions Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
        "startDate":"2022-09-16",
        "endDate":"2022-09-16"
    }
    Return: JSON String
    ********************************************************/
    async teamBonusSubscriptionsListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize
            let query = [{}];
            if(data.startDate || data.endDate){
                query = await new DownloadsController().dateFilter({key: 'createdAt', startDate: data.startDate, endDate: data.endDate})
                console.log(`query: ${JSON.stringify(query)}`)
            }
            const result = await TeamBonusSubscriptions.aggregate([
                {$match: { isDeleted: false, $and: query}},
                ...listingStages,
                {$sort: sort},
                {$skip: skip},
                {$limit: limit},
            ]);
            const total = await TeamBonusSubscriptions.count({isDeleted:false})
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
       Purpose: Delete Single And Multiple Team Bonus Subscriptions Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "teamBonusSubscriptionIds":["5cd01da1371dc7190b085f86"]
       }
       Return: JSON String
       ********************************************************/
       async deleteTeamBonusSubscriptions() {
        try {
            if (!this.req.body.teamBonusSubscriptionIds) {
                return this.res.send({ status: 0, message: "Please send teamBonusSubscriptionIds" });
            }
            let msg = 'Team Bonus Subscription not deleted.';
            let status = 1;
            const updatedTeamBonusSubscriptions = await TeamBonusSubscriptions.updateMany({ _id: { $in: this.req.body.teamBonusSubscriptionIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedTeamBonusSubscriptions) {
                msg = updatedTeamBonusSubscriptions.modifiedCount ? updatedTeamBonusSubscriptions.modifiedCount + ' team level deleted.' : updatedTeamBonusSubscriptions.matchedCount== 0 ? "Details not found" : msg;
                status = updatedTeamBonusSubscriptions.matchedCount== 0? 0:1
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
            "filteredFields": ["Date", "Name"] }
       Return: JSON String
       ********************************************************/
       async downloadTeamBonusSubscriptionFiles() {
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
            ["Date","Name","Type", "Price", "GSTPercentage", "GSTAmount", "Final Price", "Points", "Points Validity", "Code"]

            data['model'] = TeamBonusSubscriptions;
            data['stages'] = downloadFilesStages;
            data['key'] = 'createdAt';
            data['query'] = { isDeleted: false, $and: query};
            data['fileName'] = 'team_bonus_subscription'

            const download = await new DownloadsController().downloadFiles(data)
            return this.res.send({ status:1, message: `${(data.type).toUpperCase()} downloaded successfully`, data: download });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = TeamBonusSubscriptionsController;