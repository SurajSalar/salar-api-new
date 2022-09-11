const _ = require("lodash");

const Controller = require("../base");
const { Category } = require('../../models/s_category')
const { GameCategory } = require('../../models/s_category_game')
const { SubCategory } = require("../../models/s_sub_category")
const { ChildCategory } = require("../../models/s_child_category")
const { Brand } = require("../../models/s_brand")
const { OrderSummary } = require("../../models/s_order_summary")
const { Order } = require("../../models/s_orders")
const { Cart } = require("../../models/s_cart")

const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');

class OrderController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
    }

    async addToCart() {
        try {
            const cart = await Cart.insertMany(this.req.body)
            return this.res.send({ status: 1, data: cart, message: "cart updated" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    async getCart() {
        try {
            const cart = await Cart.find({ user_id: this.req.user }).populate({ "path": "ecomm_prod_id" }).populate({ "path": "game_prod_id" })
            return this.res.send({ status: 1, data: cart, message: "cart" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    async placeOrder() {
        try {

            let digitalOrders = [];
            let ecommOrders = [];
            let orderData = this.req.body.products;
            for (let order of orderData)
                if (order.hasOwnProperty('ecomm_prod_id'))
                    ecommOrders.push(order);
                else
                    digitalOrders.push(order)

            if (digitalOrders.length) {
                let orders = []
                let totalPrice = 0;
                for (let order of digitalOrders) {
                    let temp = {}
                    temp.user_id = this.req.user;
                    temp.game_prod_id = order.game_prod_id._id;
                    temp.quantity = order.quantity;
                    temp.unit_price = order.game_prod_id.final_price;
                    temp.final_price = order.game_prod_id.final_price * order.quantity;
                    temp.status = 1;
                    temp.payu_order_id = ""
                    temp.logi_order_id = ""
                    orders.push(temp);
                    totalPrice += temp.final_price
                }

                let orderInsert = await Order.insertMany(orders);

                let orderIds = orderInsert.map(order => order._id)

                let insertSummary = await OrderSummary.insertMany([{
                    order_id: orderIds,
                    user_id: this.req.user,
                    // refferal_id: "",
                    total_price: totalPrice,
                    tranx_fees: this.req.body.tranx_fees,
                    trnx_method: this.req.body.trnx_method
                }])
            }

            if (ecommOrders.length) {
                let orders = []
                let totalPrice = 0;
                for (let order of ecommOrders) {
                    let temp = {}
                    temp.user_id = this.req.user;
                    temp.ecomm_prod_id = order.ecomm_prod_id._id;
                    temp.quantity = order.quantity;
                    temp.unit_price = order.ecomm_prod_id.final_price;
                    temp.final_price = order.ecomm_prod_id.final_price * order.quantity;
                    temp.status = 1;
                    temp.payu_order_id = ""
                    temp.logi_order_id = ""
                    orders.push(temp);
                    totalPrice += temp.final_price
                }

                let orderInsert = await Order.insertMany(orders);

                let orderIds = orderInsert.map(order => order._id)

                let insertSummary = await OrderSummary.insertMany([{
                    order_id: orderIds,
                    user_id: this.req.user,
                    // refferal_id: "",
                    total_price: totalPrice,
                    tranx_fees: this.req.body.tranx_fees,
                    trnx_method: this.req.body.trnx_method
                }])
            }

            this.res.send({ status: 1, message: "Order Placed" });
        } catch (error) {
            console.error("error in placing game product order ", error);
            this.res.status(500).send({ status: 0, message: error.message, data: error });
        }
    }

}

module.exports = OrderController;