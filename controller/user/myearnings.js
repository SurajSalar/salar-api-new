/** @format */

const _ = require("lodash");

const Controller = require("../base");
const RequestBody = require("../../utilities/requestBody");
const Authentication = require("../auth");
const CommonService = require("../../utilities/common");
const Services = require("../../utilities/index");
const Model = require("../../utilities/model");
const {
  SponsorCommission,
  AurCommission,
  ProCommission,
  MemberShipCommission,
  TeamIncome,
} = require("../../models/s_myearnings");

class MyEarningsController extends Controller {
  constructor() {
    super();
    this.commonService = new CommonService();
    this.services = new Services();
    this.requestBody = new RequestBody();
    this.authentication = new Authentication();
  }

  AddSponsorCommission = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "dataOfPurchase",
        "productType",
        "orderId",
        "UserName",
        "sponsorCommission",
        "status",
        "user_id",
      ];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const newCode = await new Model(SponsorCommission).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Sponsor Commission not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "Sponsor Commission added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getSponsorCommissionByUserId = async () => {
    try {
      let data = this.req.params;
      const fieldsArray = ["user_id"];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const user = await SponsorCommission.find({ user_id: data?.user_id });
        if (_.isEmpty(user)) {
          return this.res.send({
            status: 0,
            message: "Please valid user_id",
          });
        }
        return this.res.send({
          status: 1,
          payload: user,
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  AddAurCommission = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "dataOfPurchase",
        "productType",
        "orderId",
        "UserName",
        "aurCommission",
        "status",
        "user_id",
      ];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const newCode = await new Model(AurCommission).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "AurCommission not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "AurCommission added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getAurCommissionByUserId = async () => {
    try {
      let data = this.req.params;
      const fieldsArray = ["user_id"];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const user = await AurCommission.find({ user_id: data?.user_id });
        if (_.isEmpty(user)) {
          return this.res.send({
            status: 0,
            message: "Please valid user_id",
          });
        }
        return this.res.send({
          status: 1,
          payload: user,
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  AddProCommission = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "dataOfPurchase",
        "productType",
        "orderId",
        "UserName",
        "proCommission",
        "status",
        "user_id",
      ];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const newCode = await new Model(ProCommission).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Points not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "ProCommission added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getProCommissionByUserId = async () => {
    try {
      let data = this.req.params;
      const fieldsArray = ["user_id"];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const user = await ProCommission.find({ user_id: data?.user_id });
        if (_.isEmpty(user)) {
          return this.res.send({
            status: 0,
            message: "Please valid user_id",
          });
        }
        return this.res.send({
          status: 1,
          payload: user,
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  AddMemberShipCommission = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "date",
        "orderId",
        "genCode",
        "tree",
        "reqMembers",
        "joinedMembers",
        "commissionEarned",
        "status",
        "user_id",
      ];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const newCode = await new Model(MemberShipCommission).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Points not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "MemberShip Commission added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getMemberShipCommissionByUserId = async () => {
    try {
      let data = this.req.params;
      const fieldsArray = ["user_id"];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const user = await MemberShipCommission.find({
          user_id: data?.user_id,
        });
        if (_.isEmpty(user)) {
          return this.res.send({
            status: 0,
            message: "Please valid user_id",
          });
        }
        return this.res.send({
          status: 1,
          payload: user,
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  AddIncome = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "dataOfPurchase",
        "productType",
        "orderId",
        "productName",
        "UserName",
        "uplinkerId",
        "teamIncome",
        "status",
        "user_id",
      ];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const newCode = await new Model(TeamIncome).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Points not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "Income added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getIncomeByUserId = async () => {
    try {
      let data = this.req.params;
      const fieldsArray = ["user_id"];
      const emptyFields = await this.requestBody.checkEmptyWithFields(
        data,
        fieldsArray,
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({
          status: 0,
          message:
            "Please send" + " " + emptyFields.toString() + " fields required.",
        });
      } else {
        const user = await TeamIncome.find({
          user_id: data?.user_id,
        });
        if (_.isEmpty(user)) {
          return this.res.send({
            status: 0,
            message: "Please valid user_id",
          });
        }
        return this.res.send({
          status: 1,
          payload: user,
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };
}

module.exports = MyEarningsController;
