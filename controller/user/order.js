const _ = require("lodash");

const Controller = require("../base");
const { Category } = require('../../models/s_category')
const { GameCategory } = require('../../models/s_category_game')
const { SubCategory } = require("../../models/s_sub_category")
const { Plan } = require("../../models/s_plan_game")
const { GameProduct } = require("../../models/s_game_product")
const { OrderSummary } = require("../../models/s_order_summary")
const { Order } = require("../../models/s_orders")
const { Cart } = require("../../models/s_cart")
const RequestBody = require("../../utilities/requestBody");
const CommonService = require("../../utilities/common");
const Services = require('../../utilities/index');
const { Users } = require("../../models/s_users");

class OrderController extends Controller {
    constructor() {
        super();
        this.commonService = new CommonService();
        this.services = new Services();
        this.requestBody = new RequestBody();
    }

    async addToCart() {
        try {
            let cartBody = this.req.body.map(cart => {
                cart.user_id = this.req.user;
                return cart
            })
            const cart = await Cart.insertMany(cartBody)
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

    async statusCart() {
        console.log(this.req.params.id);
       // return false;
        try {

            const cart = await Cart.findByIdAndDelete({ _id: this.req.params.id });
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
            let orderInsertId = []
            let totalPrice = 0;
            for (let order of orderData)
                if (order.hasOwnProperty('ecomm_prod_id'))
                    ecommOrders.push(order);
                else
                    digitalOrders.push(order)

            if (digitalOrders.length) {
                console.log("mlm orders ", digitalOrders.length)
                for (let order of digitalOrders) {
                    let temp = {}
                    let planDetails = await Plan.findById(order.game_prod_id.plan);
                    temp.user_id = this.req.user;
                    temp.game_prod_id = order.game_prod_id._id;
                    temp.quantity = order.quantity;
                    temp.unit_price = order.game_prod_id.final_price;
                    temp.final_price = order.game_prod_id.final_price * order.quantity;
                    temp.status = 1;
                    temp.payu_order_id = ""
                    temp.logi_order_id = ""
                    if (planDetails.width > 0 && planDetails.depth > 0) {
                        if (this.req.body.refferal_id) {
                            // Order using refferal id

                            let refferalUser = await Users.find({ registerId: this.req.body.refferal_id })
                            let existOrder = await Order.find({ game_prod_id: order.game_prod_id._id, user_id: refferalUser._id }).sort({ "created_at": 'asc' });

                            for (let extorder of existOrder) {
                                if (extorder.child_ids.length < planDetails.width) {
                                    temp.parent_id = extorder._id
                                    temp.isInitiater = false
                                    temp.initiater_id = extorder.initiater_id
                                    temp.child_ids = []
                                    temp.depth = extorder.depth + 1
                                    console.log("order type obj ", temp)
                                    let orderInsert = await Order.create(temp);
                                    orderInsertId.push(orderInsert._id)
                                    let updateRefferalOrder = await Order.findByIdAndUpdate(extorder._id, { $push: { child_ids: orderInsert._id } })
                                    break;
                                }
                            }
                        } else {
                            let existOrder = await Order.find({ game_prod_id: order.game_prod_id._id }).sort({ "created_at": 'asc' });
                            console.log("Existing order : ", existOrder.length)
                            if (existOrder && existOrder.length) {
                                for (let extorder of existOrder) {
                                    if (extorder.child_ids.length < planDetails.width) {
                                        temp.parent_id = extorder._id
                                        temp.isInitiater = false
                                        temp.initiater_id = extorder.isInitiater ? extorder._id : extorder._id
                                        temp.child_ids = []
                                        temp.depth = (extorder.depth ? extorder.depth : 0) + 1
                                        console.log("order type obj ", temp)
                                        let orderInsert = await Order.create(temp);
                                        orderInsertId.push(orderInsert._id)
                                        let updateExistOrder = await Order.findByIdAndUpdate(extorder._id, { $push: { child_ids: orderInsert._id } })
                                        break;
                                    }
                                }
                            } else {
                                temp.parent_id = null
                                temp.isInitiater = true
                                temp.initiater_id = null
                                temp.position = 0
                                temp.depth = 0
                                temp.child_ids = []
                                console.log("order type obj ", temp)
                                let orderInsert = await Order.create(temp);
                                orderInsertId.push(orderInsert._id)
                            }
                        }
                    } else {

                        let orderInsert = await Order.create(temp);
                        orderInsertId.push(orderInsert._id)
                    }
                    totalPrice += temp.final_price
                }
            }

            if (ecommOrders.length) {
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
                    let orderInsert = await Order.create(temp);
                    orderInsertId.push(orderInsert._id)
                    totalPrice += temp.final_price
                }
            }
            let insertSummary = await OrderSummary.insertMany([{
                order_id: orderInsertId,
                user_id: this.req.user,
                refferal_id: this.req.body.refferal_id,
                total_price: totalPrice,
                tranx_fees: this.req.body.tranx_fees,
                trnx_method: this.req.body.trnx_method
            }])
            this.res.send({ status: 1, message: "Order Placed", data: insertSummary });
        } catch (error) {
            console.error("error in placing game product order ", error);
            this.res.status(500).send({ status: 0, message: error.message, data: error });
        }
    }

    async getOrderSummary() {
        try {
            const orderSummary = await OrderSummary.find({ user_id: this.req.user }).populate({ "path": "order_id" })
            return this.res.send({ status: 1, data: orderSummary, message: "orderSummary" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

    async getAllOrder() {
        try {
            const order = await Order.find({ user_id: this.req.user }).populate({ "path": "ecomm_prod_id" }).populate({ "path": "game_prod_id" })
            return this.res.send({ status: 1, data: order, message: "Orders" });

        } catch (error) {
            console.log("error- ", error);
            return this.res.send({ status: 0, message: "Internal server error" });
        }
    }

}

module.exports = OrderController;