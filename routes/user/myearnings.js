/** @format */

const MyEarningsController = require("../../controller/user/myearnings.js");
const Authorization = require("../../middleware/auth");

module.exports = (router, app) => {
  router.post(
    "/myearns/addsponsercommission",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.AddSponsorCommission();
    },
  );

  router.get(
    "/myearns/getsponsercommission/:user_id",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.getSponsorCommissionByUserId();
    },
  );

  router.post(
    "/myearns/addaurcommission",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.AddAurCommission();
    },
  );

  router.get(
    "/myearns/getaurcommission/:user_id",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.getAurCommissionByUserId();
    },
  );

  router.post(
    "/myearns/addprocommission",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.AddProCommission();
    },
  );

  router.get(
    "/myearns/getprocommission/:user_id",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.getProCommissionByUserId();
    },
  );

  router.post(
    "/myearns/addmembershipcommission",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.AddMemberShipCommission();
    },
  );

  router.get(
    "/myearns/getmembershipcommission/:user_id",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.getMemberShipCommissionByUserId();
    },
  );

  router.post(
    "/myearns/addincome",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.AddIncome();
    },
  );

  router.get(
    "/myearns/getincome/:user_id",
    Authorization.isAuthorised,
    (req, res, next) => {
      const myearnObj = new MyEarningsController().boot(req, res);
      return myearnObj.getIncomeByUserId();
    },
  );
};
