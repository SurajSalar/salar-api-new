const _ = require("lodash");

const Controller = require("../base");
const RequestBody = require("../../utilities/requestBody");
const Authentication = require("../auth");
const CommonService = require("../../utilities/common");
const Services = require("../../utilities/index");
const Model = require("../../utilities/model");
const { Plan } = require("../../models/s_plan_game");
const { Mlm } = require("../../models/s_mlm");
class MlmAllController extends Controller {
  constructor() {
    super();
    this.commonService = new CommonService();
    this.services = new Services();
    this.requestBody = new RequestBody();
    this.authentication = new Authentication();
  }

  async AddUser() {
    try{
      const data = this.req.body;
      let plan_id = data.plan_id;
      let user_id = data.user_id;
      let name = data.name;
      let ref = data.reffer_id
      let sponser_id = data.sponser_id;
      const plan = await Plan.findOne({ _id: plan_id });
      let width = plan.width;
    
      const mlm = await Mlm.findOne();
  
      const result = await this.getObject(mlm, user_id);
   
      let addUser = result.children;
  
      if (addUser.length >= width) {
        return this.res.send({ msg: "user can not be added" });
      } else {
        const user = {
          user_id: user_id,
          amount: 14,
          name: name,
          reffer_id: ref,
          join_date: Date.now(),
          sponser_id: sponser_id,
          children: [],
        };
        addUser.push(user);
      }
  
      const User = await new Model(Mlm).store(mlm);
      return this.res.send(User);
    } catch (e){
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
      const data = this.req.body;
      let user_id = data.user_id;
      const mlm = await Mlm.findOne();
      const result = await this.getObject(mlm, user_id);
      return this.res.send({ status: 1, result: result });
    } catch (e) {
      console.log("error- ", e);
      return this.res.send({ status: 0, message: "Internal server error" });
    }
  }
  getObject(object, string) {
    var result;
    if (!object || typeof object !== "object") return;
    Object.values(object).some((v) => {
      if (v === string) return (result = object);
      return (result = this.getObject(v, string));
    });
    return result;
  }
}

module.exports = MlmAllController;
