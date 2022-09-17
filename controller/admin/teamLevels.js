const _ = require("lodash");

const Controller = require("../base");
const { TeamLevels } = require('../../models/s_team_levels');
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Model = require("../../utilities/model");


class TeamLevelsController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.requestBody = new RequestBody();
    }
  
        /********************************************************
   Purpose: Create and Update Team Levels
   Method: Post
   Authorisation: true
   Parameter:
      {
          "width": 1,
          "depth": 2,
          "ULDownline": 3
      }
   Return: JSON String
   ********************************************************/
   async addAndUpdateTeamLevel() {
    try {
        let data = this.req.body;
        const fieldsArray = ["width","depth","ULDownline"]
        const emptyFields = await this.requestBody.checkEmptyWithFields(data, fieldsArray);
        if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
            return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
        }
        const getTeamLevel = await TeamLevels.findOne({isDeleted: false});
        if (_.isEmpty(getTeamLevel)) {
            const newTeamLevel = await new Model(TeamLevels).store(data);
            if (_.isEmpty(newTeamLevel)) {
                return this.res.send({ status: 0, message: "Details not saved" });
            }
            return this.res.send({ status: 1, message: "Team Level details created successfully", data: newTeamLevel });
        }else{
            const updatedTeamLevel = await TeamLevels.findOneAndUpdate({_id: getTeamLevel._id},data,{upsert:true, new:true})
            console.log("updatedTeamLevel", updatedTeamLevel)
            if (_.isEmpty(updatedTeamLevel)) {
                return this.res.send({ status: 0, message: "Details are not updated" });
            }
            return this.res.send({ status: 1, message: "Team Level details updated successfully", data: updatedTeamLevel });
        }
    } catch (error) {
        console.log("error- ", error);
        return this.res.send({ status: 0, message: "Internal server error" });
    }
}
    /********************************************************
    Purpose: Team Levels Listing In Admin
    Method: Post
    Authorisation: true
    Parameter:
    {
        "page":1,
        "pagesize":3,
    }
    Return: JSON String
    ********************************************************/
    async teamLevelsListing() {
        try {
            const data = this.req.body;
            const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
            const sort = data.sort ? data.sort : { _id: -1 };
            const limit = data.pagesize
            const result = await TeamLevels.find({isDeleted:false}).sort(sort).skip(skip).limit(limit);
            const total = await TeamLevels.count({isDeleted:false})
            return this.res.send({status:1, message: "Listing details are: ", data: result,page: data.page, pagesize: data.pagesize, total: total});
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    /********************************************************
    Purpose: Get Team Levels Details
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getTeamLevelDetails() {
        try {
            if (!this.req.params.teamLevelId) {
                return this.res.send({ status: 0, message: "Please send proper params" });
            }
            const teamLevel = await TeamLevels.findOne({ _id: this.req.params.teamLevelId, isDeleted:false }, { __v: 0 });
            if (_.isEmpty(teamLevel))
                return this.res.send({ status: 0, message: "Team Level not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: teamLevel });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


    /********************************************************
    Purpose: Get Team Levels 
    Method: GET
    Authorisation: true
    Return: JSON String
    ********************************************************/
    async getTeamLevel() {
        try {
            const teamLevel = await TeamLevels.findOne({ isDeleted:false }, { __v: 0 });
            if (_.isEmpty(teamLevel))
                return this.res.send({ status: 0, message: "Team Level not found" });
            return this.res.send({ status: 1, message: "Details are: ", data: teamLevel });
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

        /********************************************************
     Purpose: single and multiple team level's change status
     Parameter:
     {
        "teamLevelIds":["5ad5d198f657ca54cfe39ba0","5ad5da8ff657ca54cfe39ba3"],
        "status":true
     }
     Return: JSON String
     ********************************************************/
     async changeStatusOfTeamLevels() {
        try {
            let msg = "Team Levels status not updated";
            const updatedTeamLevels = await TeamLevels.updateMany({ _id: { $in: this.req.body.teamLevelIds } }, { $set: { status: this.req.body.status } });
            console.log("updatedTeamLevels",updatedTeamLevels)
            if (updatedTeamLevels) {
                msg = updatedTeamLevels.modifiedCount ? updatedTeamLevels.modifiedCount + " team levels updated" : updatedTeamLevels.matchedCount == 0 ? "Team Levels not exists" : msg;
            }
            return this.res.send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    /********************************************************
       Purpose: Delete Single And Multiple Team Levels Details In Admin
       Method: Post
       Authorisation: true
       Parameter:
       {
           "teamLevelIds":["5cd01da1371dc7190b085f86"]
       }
       Return: JSON String
       ********************************************************/
       async deleteTeamLevels() {
        try {
            if (!this.req.body.teamLevelIds) {
                return this.res.send({ status: 0, message: "Please send teamLevelIds" });
            }
            let msg = 'Team Level not deleted.';
            let status = 1;
            const updatedTeamLevels = await TeamLevels.updateMany({ _id: { $in: this.req.body.teamLevelIds }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedTeamLevels) {
                msg = updatedTeamLevels.modifiedCount ? updatedTeamLevels.modifiedCount + ' team level deleted.' : updatedTeamLevels.matchedCount== 0 ? "Details not found" : msg;
                status = updatedTeamLevels.matchedCount== 0? 0:1
            }
            return this.res.send({ status, message: msg });
            
        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }


}
module.exports = TeamLevelsController;