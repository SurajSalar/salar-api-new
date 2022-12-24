/** @format */

const _ = require("lodash");

const Controller = require("../base");
const RequestBody = require("../../utilities/requestBody");
const Authentication = require("../auth");
const CommonService = require("../../utilities/common");
const Services = require("../../utilities/index");
const Model = require("../../utilities/model");
const {
  Points,
  Rewards,
  ShippingAmount,
  CCDC,
  Offers,
} = require("../../models/s_mystuff");

class MyStuffController extends Controller {
  constructor() {
    super();
    this.commonService = new CommonService();
    this.services = new Services();
    this.requestBody = new RequestBody();
    this.authentication = new Authentication();
  }

  AddPoints = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "dataOfPurchase",
        "productType",
        "orderId",
        "productName",
        "finalPrice",
        "purchasedType",
        "recievedPoints",
        "validFrom",
        "validTo",
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
        const newCode = await new Model(Points).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Points not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "Points added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getPointsByUserId = async () => {
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
        const user = await Points.find({ user_id: data?.user_id });
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

  AddRewards = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "dataOfPurchase",
        "orderId",
        "productName",
        "rewardFor",
        "achievedDate",
        "status",
        "details",
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
        const newCode = await new Model(Rewards).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Rewards not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "Rewards added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getRewardsByUserId = async () => {
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
        const user = await Rewards.find({ user_id: data?.user_id });
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

  AddShoppingAmount = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "dataOfPurchase",
        "orderId",
        "productName",
        "genCode",
        "commissionName",
        "commissionType",
        "commissionLevel",
        "shoppingAmount",
        "levelCommissionEarned",
        "requiredMembers",
        "joinedMembers",
        "membershipStatus",
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
        const newCode = await new Model(ShippingAmount).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Shopping Amount not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "Shopping Amount added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getShoppingAmountByUserId = async () => {
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
        const user = await ShippingAmount.find({ user_id: data?.user_id });
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

  AddOffers = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "date",
        "offersDeals",
        "validTill",
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
        const newCode = await new Model(Offers).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "Offers not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "Offers added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getOffersByUserId = async () => {
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
        const user = await Offers.find({ user_id: data?.user_id });
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

  AddCCDC = async () => {
    try {
      let data = this.req.body;

      const fieldsArray = [
        "date",
        "txnNo",
        "credited",
        "debited",
        "type",
        "purpose",
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
        const newCode = await new Model(CCDC).store(data);
        if (_.isEmpty(newCode)) {
          return this.res.send({
            status: 0,
            message: "CCDC not saved",
          });
        }
        return this.res.send({
          status: 1,
          message: "CCDC added successfully",
        });
      }
    } catch (error) {
      console.log("error- ", error);
      this.res.status(500).send({ status: 0, message: error });
    }
  };

  getCCDCByUserId = async () => {
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
        const user = await CCDC.find({ user_id: data?.user_id });
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

module.exports = MyStuffController;
