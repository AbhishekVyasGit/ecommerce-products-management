import mongodb from "mongodb"
import db from "../configs/db.js";
const Cart = db.collection("cart");
const User = db.collection("user");
const Product = db.collection("product");

const createCart = async (req, res) => {
    try {

        if (req.params.userId !== req.body.userId) return res.status(400).send({ status: false, message: "userId in params and body does not match" });

        const userExists = await User.find({ _id: new mongodb.ObjectId(req.body.userId) });

        if (!userExists) return res.status(400).send({ status: false, message: "user does not exist" });



        if (req.body.cartId == undefined) {

            const cartExists = await Cart.findOne({ userId: req.params.userId });

            if (cartExists) return res.status(400).send({ status: false, message: "Cart already exist for this user , please enter cartId" });

            const obj = {};

            let cartItems = req.body.items;

            for (let item of cartItems) {
                if (obj[item.productId] == undefined) {
                    obj[item.productId] = item.quantity;
                }
                else {
                    obj[item.productId] += item.quantity;
                }
            };

            const shortedCartItems = Object.keys(obj).map(item => ({ productId: item, quantity: obj[item] }));

            let totalPrice = 0;

            for (let i = 0; i < shortedCartItems.length; i++) {

                let prodId = shortedCartItems[i].productId;

                let validProduct = await Product.findOne({ _id: new mongodb.ObjectId(prodId), isDeleted: false });

                if (!validProduct) return res.status(400).send({ status: false, message: "products are not valid" });

                totalPrice += validProduct.price * shortedCartItems[i].quantity;

            }

            let date = new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'full',
            });

            req.body.createdAt = date;
            req.body.updatedAt = date;
            req.body.totalItems = shortedCartItems.length;
            req.body.totalPrice = totalPrice;
            req.body.items = shortedCartItems;

            const createCart = await Cart.insertOne(req.body);

            return res.status(201).send({ status: true, data: createCart });

        }

        else {


            const cartExists = await Cart.findOne({ _id: new mongodb.ObjectId(req.body.cartId) });

            if (!cartExists) return res.status(400).send({ status: false, message: "cartId does not exist" });

            if (cartExists.userId.toString() !== req.params.userId) return res.status(400).send({ status: false, message: "Params userId does not match with the userId inside of Cart" });;

            const obj = {};

            let cartItems = req.body.items;

            for (let item of cartItems) {
                if (obj[item.productId] == undefined) {
                    obj[item.productId] = item.quantity;
                }
                else {
                    obj[item.productId] += item.quantity;
                }
            };

            const shortedCartItems = Object.keys(obj).map(item => ({ productId: item, quantity: obj[item] }));

            let totalPrice = 0;

            for (let i = 0; i < shortedCartItems.length; i++) {

                let prodId = shortedCartItems[i].productId;

                let validProduct = await Product.findOne({ _id: new mongodb.ObjectId(prodId), isDeleted: false });

                if (!validProduct) return res.status(400).send({ status: false, message: "products are not valid" });

                totalPrice += validProduct.price * shortedCartItems[i].quantity;

            }

            for (let item of cartExists.items) {
                if (obj[item.productId] == undefined) {
                    obj[item.productId] = item.quantity;
                }
                else {
                    obj[item.productId] += item.quantity;
                }
            };


            const itemsResult = Object.keys(obj).map(item => ({ productId: item, quantity: obj[item] }));

            let date = new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'full',
            });

            req.body.updatedAt = date;
            req.body.items = itemsResult;
            req.body.totalItems = itemsResult.length;
            req.body.totalPrice = cartExists.totalPrice + totalPrice;

            const updatedCart = await Cart.findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.cartId) }, { $set: { items: req.body.items, totalPrice: req.body.totalPrice, totalItems: req.body.totalItems, updatedAt: date } }, { returnDocument: 'after' });

            return res.status(201).send({ status: true, data: updatedCart });
        }


    } catch (error) {
        console.log(error);
        return res.status(400).send({ status: false, message: error.message });
    }
}





const updateCart = async (req, res) => {    // remove or reduce the product

    try {


        let { userId, cartId, productId, removeProduct } = req.body;
        if (!cartId) return res.status(400).send({ status: false, message: "please enter the cartId" });

        if (!(removeProduct == 1 || removeProduct == 0)) return res.status(400).send({ status: false, message: "please select 0 for removed the product  or 1 for decrement by 1 in product" });

        if (req.params.userId !== userId) return res.status(400).send({ status: false, message: "userId in params and body does not match" });

        const userExists = await User.find({ _id: new mongodb.ObjectId(userId) });

        if (!userExists) return res.status(400).send({ status: false, message: "user does not exist" });

        const cartExists = await Cart.findOne({ _id: new mongodb.ObjectId(cartId) });

        if (!cartExists) return res.status(400).send({ status: false, message: "cart does not exist" });

        if (cartExists.userId.toString() !== req.params.userId) return res.status(400).send({ status: false, message: "Params userId does not match with the userId inside of Cart" });

        const validProduct = await Product.findOne({ _id: new mongodb.ObjectId(productId), isDeleted: false });

        if (!validProduct) return res.status(400).send({ status: false, message: "ProductId Invalid or Product Deleted" });

        if (!(removeProduct == 0 || removeProduct == 1)) return res.status(400).send({ status: false, message: "please select 0 for removed product or 1 for decrement by 1 in product" });


        if (removeProduct == 0) {

            let prodIdExist = false;
            let quantities;

            for (let i = 0; i < cartExists.items.length; i++) {

                if (cartExists.items[i].productId.toString() == productId) {

                    prodIdExist = true;

                    quantities = cartExists.items[i].quantity

                    cartExists.items[i].quantity = 0;


                }
            };

            if (prodIdExist !== true) return res.status(400).send({ status: false, message: "Product Deleted or does not Exists" });

            const remainingCartItems = cartExists.items.filter((item => item.quantity != 0));

            let totalItems = remainingCartItems.length;

            let totalPrice = cartExists.totalPrice;
            totalPrice -= (validProduct.price * quantities);

            let date = new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'full',
            });


            const updatedCart = await Cart.findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.cartId) }, { $set: { items: remainingCartItems, totalItems: totalItems, totalPrice: totalPrice, updatedAt: date } }, { returnDocument: 'after' })

            return res.status(201).send({ status: true, data: updatedCart });
        }

        else if (removeProduct == 1) {

                let prodIdExist = false;
                let quantities;
    
                for (let i = 0; i < cartExists.items.length; i++) {
    
                    if (cartExists.items[i].productId.toString() == productId) {
    
                        prodIdExist = true;
        
                        cartExists.items[i].quantity -= 1;
    
    
                    }
                };
    
                if (prodIdExist !== true) return res.status(400).send({ status: false, message: "Product Deleted or does not Exists" });
    
                const remainingCartItems = cartExists.items.filter((item => item.quantity != 0));
    
                let totalItems = remainingCartItems.length;
    
                let totalPrice = cartExists.totalPrice;
                totalPrice -= validProduct.price;
    
                let date = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'full',
                    timeStyle: 'full',
                });
    
    
                const updatedCart = await Cart.findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.cartId) }, { $set: { items: remainingCartItems, totalItems: totalItems, totalPrice: totalPrice, updatedAt: date } }, { returnDocument: 'after' })
    
                return res.status(201).send({ status: true, data: updatedCart });
        }
    

    } catch (error) {
        console.log(error);
        return res.status(400).send({ status: false, message: error.message });
    }

}





const getCart = async (req, res) => {

    try {

        const userExists = await User.findOne({ _id: new mongodb.ObjectId(req.params.userId) });

        if (!userExists) return res.status(400).send({ status: false, message: "User does not Exists" });

        const cartDetails = await Cart.find({ userId: req.params.userId }).toArray();

        if (!cartDetails) return res.status(400).send({ status: false, message: "cart does not find , something went wrong..." });

        return res.status(200).send({ status: true, data: cartDetails });

    } catch (error) {

        return res.status(400).send({ status: false, message: error.message });

    }
}



const deleteCart = async (req, res) => {

    try {

        const userExists = await User.findOne({ _id: new mongodb.ObjectId(req.params.userId) });

        if (!userExists) return res.status(400).send({ status: false, message: "User does not Exists" });

        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'full',
        });

        const cartDetails = await Cart.findOneAndUpdate({ userId: req.params.userId }, { $set: { items: [], totalItems: 0, totalPrice: 0, updatedAt: date } }, { returnDocument: 'after' });

        return res.status(200).send({ status: true, data: cartDetails });

    } catch (error) {

        return res.status(400).send({ status: false, message: error.message });

    }
}


export { createCart, updateCart, getCart, deleteCart };


