/** @format */

const _ = require("lodash");

const Controller = require("../base");
const RequestBody = require("../../utilities/requestBody");
const Authentication = require("../auth");
const CommonService = require("../../utilities/common");
const Services = require("../../utilities/index");
const Model = require("../../utilities/model");
const { Plan } = require("../../models/s_plan_game");
const { Mlm } = require("../../models/s_mlm");
const { Users } = require("../../models/s_users");

class MlmAllController extends Controller {
  constructor() {
    super();
    this.commonService = new CommonService();
    this.services = new Services();
    this.requestBody = new RequestBody();
    this.authentication = new Authentication();
  }

  /********************************************************
        Purpose: Add root user
        Method: Post
        Authorisation: true
        Parameter:
        {
	        "plan_id":"630289baf0c78a9b5f9b9030",
	        "user_id":"62c39bdaa8b6ef3eebb6f082", 
	        "name":"sivaji123",
          "reffer_id":"63180efcb1c848381cd9a257"
        }
        Return: JSON String
    ********************************************************/
  async AddUser() {
    try {
      const data = this.req.body;
      let plan_id = data.plan_id;
      let user_id = data.user_id;
      let name = data.name;
      let ref = data.reffer_id;
      let sponser_id = data.sponser_id;
      const plan = await Plan.findOne({ _id: plan_id });
      const u = await Users.findOne({ _id: user_id });
      let width = plan.width;
      const mlm = await Mlm.findOne();
      const result = await this.getObject(mlm, ref ? ref : null);
      let addUser = result.children;
      if (addUser.length >= width) {
        return this.res.send({ msg: "user can not be added" });
      } else {
        const user = {
          user_id: user_id,
          amount: data.amount ? data.amount : null,
          name: u.name ? u.name : name,
          reffer_id: ref,
          join_date: Date.now(),
          sponser_id: sponser_id ? sponser_id : null,
          children: [],
        };
        addUser.push(user);
      }

      const resultData = await new Model(Mlm).store(mlm);
      return this.res.send(resultData);
    } catch (e) {
      console.log("error- ", e);
      return this.res.send({ status: 0, message: "Internal server error" });
    }
  }

  /********************************************************
        Purpose: Add root user
        Method: Post
        Authorisation: true
        Parameter:
       {
      plan: "630289baf0c78a9b5f9b9030",
      mlm: [
        {
          user_id: "639970df3b7e16b87e39942a",
          level: 1,
          amount: 12,
          name: "gayathri",
          reffer_id: 123142141241,
          join_date: Date.now(),
          sponser_id: "SALAR001",
          children: [], // children should be empty always for root user adding
        },
      ],
    }      
        Return: JSON String
    ********************************************************/
  async AddRootUser() {
    try {
      const data = this.req.body;
      const result = {
        plan: data.plan_id,
        mlm: [
          {
            user_id: data.user_id,
            level: 1,
            amount: data.amount ? data.amount : null,
            name: data.name,
            reffer_id: data.reffer_id ? data.reffer_id : null,
            join_date: Date.now(),
            sponser_id: data.register_id,
            children: [],
          },
        ],
      };

      const rootUser = await new Model(Mlm).store(result);
      return this.res.send({ status: 1, payload: rootUser });
    } catch (e) {
      console.log("error- ", e);
      return this.res.send({ status: 0, message: "Internal server error" });
    }
  }

  async getMlmUser() {
    try {
      const data = this.req.params;
      if (!data.id) {
        return this.res.send({ status: 0, message: "please send user_id" });
      }
      const mlm = await Mlm.findOne();
      const result = await this.getObject(mlm, data.id);
      return this.res.send({ status: 1, result: result });
    } catch (e) {
      console.log("error- ", e);
      return this.res.send({ status: 0, message: "Internal server error" });
    }
  }

  getObject(object, string) {
    var result;
    if (!object || typeof object !== "object") return;
    Object.values(object).some(v => {
      if (v === string) return (result = object);
      return (result = this.getObject(v, string));
    });
    return result;
  }

  mlmUserAmountMultiplytoTeam(arr, num) {
    return arr.map(obj => {
      Object.keys(obj).forEach(key => {
        if (Array.isArray(obj[key])) {
          this.mlmUserAmountMultiplytoTeam(obj[key], num);
        }

        if (key === "amount") {
          obj[key] = obj[key] * 2;
        }
      });
      return obj;
    });
  }
}

module.exports = MlmAllController;
