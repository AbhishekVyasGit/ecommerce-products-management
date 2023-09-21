import mongodb from "mongodb"
import db from "../configs/db.js";
const Order = db.collection("order");
const User = db.collection("user");
const Product = db.collection("product");
const Cart = db.collection("cart");



const createOrder = async (req, res) => {

    try {

        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'full',
        });

        const userExists = await User.findOne({ _id: new mongodb.ObjectId(req.params.userId) });

        if (!userExists) return res.status(400).send({ status: false, message: "User does not Exists" });

        let orderExists = await Order.findOne({ userId: req.params.userId });

        if (orderExists) return res.status(400).send({ status: false, message: "Order already exists for this UserId" })

        const cartExists = await Cart.findOne({ userId: req.params.userId });

        if (!cartExists) return res.status(400).send({ status: false, message: "cart does not Exists for this order" });

        let cart = cartExists.items;

        let totalPrices = 0, totalQuantities = 0;

        for (let i = 0; i < cart.length; i++) {

            const product = await Product.findOne({ _id: new mongodb.ObjectId(cart[i].productId) });

            if (!product) return res.status(400).send({ status: false, message: "Error while fetching product Details" });

            totalPrices += (cart[i].quantity * product.price);

            totalQuantities += cart[i].quantity;

        };

        req.body.userId = req.params.userId;
        req.body.totalPrice = totalPrices;
        req.body.totalQuantity = totalQuantities;
        req.body.totalItems = cart.length;
        req.body.items = cart;
        req.body.createdAt = date;
        req.body.updatedAt = date;


        const myOrder = await Order.insertOne(req.body);

        return res.status(200).send({ status: true, data: myOrder });

    } catch (error) {

        console.log(error);

        return res.status(400).send({ status: false, message: error.message });

    }
}




const updateOrder = async (req, res) => {

    try {

        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'full',
        });

        if (req.body.userId) {
            if (req.body.userId !== req.params.userId) return res.status(400).send({ status: false, message: "UserId not match inside the body and params" });
        }

        const userExists = await User.findOne({ _id: new mongodb.ObjectId(req.params.userId) });

        if (!userExists) return res.status(400).send({ status: false, message: "User does not Exists" });

        const orderExists = await Order.findOne({ userId: req.params.userId });

        if (!orderExists) return res.status(400).send({ status: false, message: "Order does not exists for this UserId" });

        if (orderExists.userId.toString() !== req.params.userId) return res.status(400).send({ status: false, message: "Params userId does not match with the userId inside of Order" });

        const cartExists = await Cart.findOne({ userId: req.params.userId });

        if (!cartExists) return res.status(400).send({ status: false, message: "cart does not Exists for this order" });

        const validOrder = await Order.findOne({ _id: new mongodb.ObjectId(req.body.orderId) });

        if (!validOrder) return res.status(400).send({ status: false, message: "Order does not exists " })

        if (req.body.status == "canceled") {

            if (!validOrder.cancellable) return res.status(400).send({ status: false, message: "Order cannot be canceled" });

            else {

                const updatedOrder = await Order.findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.orderId) }, { $set: { status: "canceled", updatedAt: date } }, { returnDocument: 'after' });

                return res.status(201).send({ status: true, data: updatedOrder });
            }
        }

        else if (req.body.status == "completed") {

            const updatedOrder = await Order.findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.orderId) }, { $set: { status: "completed", updatedAt: date } }, { returnDocument: 'after' });

            return res.status(201).send({ status: true, data: updatedOrder });
        }

        else if (req.body.status == "pending") {

            return res.status(200).send({ status: true, message: "your order in pending" })
        }

        else {

            return res.status(400).send({ status: false, message: "bad request check inputs" })

        }

    } catch (error) {

        console.log(error);

        return res.status(400).send({ status: false, message: error.message });

    }
}


export { createOrder, updateOrder };

