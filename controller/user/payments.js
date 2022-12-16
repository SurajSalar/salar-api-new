const _ = require("lodash");

const Controller = require("../base");
const RequestBody = require("../../utilities/requestBody");
const Authentication = require("../auth");
const CommonService = require("../../utilities/common");
const Services = require("../../utilities/index");
const Model = require("../../utilities/model");
const { Order } = require("../../models/s_orders");
const { Payments } = require("../../models/s_payments");

class PaymentsController extends Controller {
  constructor() {
    super();
    this.commonService = new CommonService();
    this.services = new Services();
    this.requestBody = new RequestBody();
    this.authentication = new Authentication();
  }

  async PaymentSuccess() {
    let payData = this.req.body;
    let razorpay_payment_id = payData.razorpay_payment_id;
    let razorpay_order_id = payData.razorpay_order_id;
    let order_id = payData.order_id;

    const fieldsArray = [ "razorpay_order_id","razorpay_payment_id","order_id"];
    const emptyFields = await this.requestBody.checkEmptyWithFields(this.req.body, fieldsArray);
    if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({ status: 0, message: "Please send" + " " + emptyFields.toString() + " fields required." });
    }
    let orderDetails = await Order.find({ _id: order_id });
    if (_.isEmpty(orderDetails)) {
      return this.res.send({ status: 0, message: "order not found" });
    }

    
    let data = {
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      order_id: order_id,
      payment_status: "Success",
      refund_status: "Null",
      user_id: orderDetails[0].user_id,
      final_price: orderDetails[0].final_price,
    };

    const newPaymentData = await new Model(Payments).store(data);
    return this.res.send({ status: 1, data: newPaymentData });
  }

  async getAllPayments() {
    try {
      const payment = await Payments.find({ user_id: this.req.user })
        .populate({ path: "rzp_payment_id" })
        .populate({ path: "ecomm_prod_id" })
        .populate({ path: "game_prod_id" });
      return this.res.send({ status: 1, data: payment, message: "Payments" });
    } catch (error) {
      console.log("error- ", error);
      return this.res.send({ status: 0, message: "Internal server error" });
    }
  }

  async getPaymentsById() {
    try {
      const payment = await Payments.find({ user_id: this.req.user }).populate({
        path: "rzp_payment_id",
      });
      return this.res.send({ status: 1, data: payment, message: "Payments" });
    } catch (error) {
      console.log("error- ", error);
      return this.res.send({ status: 0, message: "Internal server error" });
    }
  }
}

module.exports = PaymentsController;
