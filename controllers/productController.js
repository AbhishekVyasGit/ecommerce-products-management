import mongodb from "mongodb"
import db from "../configs/db.js";
const Product = db.collection('product');


const createProduct = async (req, res) => {

    try {

        if (!(req.body.availableSizes.every(item => ["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(item) !== -1))) {

            return res.status(400).send({ status: false, message: "Invalid availableSizes" });
        }


        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'full',
        });

        req.body.createdAt = date;
        req.body.updatedAt = date;

        const product = await Product.insertOne(req.body);

        return res.status(201).json({ data: product })


    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}



const getAllProducts = async (req, res) => {

    try {


        if (Object.keys(req.query).length == 0) {

            const allProducts = await Product.find({isDeleted : false}).toArray();
            return res.status(200).json({ status: true, data: allProducts });
        }
        else {

            let size = req.query.size ?? ["S", "XS", "M", "X", "L", "XXL", "XL"]
            let title = req.query.name ?? /[A-Za-z0-9]/
            let priceGreaterThan = req.query.priceGreaterThan ?? 0
            let priceLessThan = req.query.priceLessThan ?? 9999999999


            if (req.query.size) {
                if (["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(req.query.size) == -1) return res.status(400).send({ status: false, message: "Size field is Invalid" })
            }
        
            if (!/^[0-9]+$/.test(priceGreaterThan)) {
                return res.status(400).send({ status: false, message: "please enter number value at priceGreaterThan field" })
            }
            

            if (!/^[0-9]+$/.test(priceLessThan)) {
                return res.status(400).send({ status: false, message: "please enter number value at priceLessThan field" })
            }


            let regexTitle = new RegExp(title, 'ig')

            if (req.query.priceSort == 1 || req.query.priceSort == -1) {
                var allProducts = await Product.find({ $and: [{ title: regexTitle }, { availableSizes: { $in: size } }, { price: { $gt: priceGreaterThan } }, { price: { $lt: priceLessThan } }, { isDeleted: false }] }).sort({ price: req.query.priceSort }).toArray()
            }
            if (req.query.priceSort == undefined) {
               var allProducts = await Product.find({ $and: [{ title: regexTitle }, { availableSizes: { $in: size } }, { price: { $gt: priceGreaterThan } }, { price: { $lt: priceLessThan } }, { isDeleted: false }] })
            }
            if (allProducts.length == 0)
                return res.status(400).send({ status: false, message: "No books with selected query params" })

            res.status(200).send({ status: true, message: `Books List`, data: allProducts })
        }

    } catch (error) {

        console.log(error);
        return res.status(400).json({ status: false, message: error.message });

    }
}


const getProduct = async (req, res) => {

    try {

        const getProduct = await Product.find({ _id: new mongodb.ObjectId(req.params.productId) }).toArray();
        return res.status(200).json({ status: true, data: getProduct });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ status: false, message: error.message });

    }
}



const updateProduct = async (req, res) => {

    try {

        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'full',
        });

        req.body.updatedAt = date;

        const getProduct = await Product.findOne({ _id: new mongodb.ObjectId(req.params.productId) });

        if (!getProduct) {
            return res.status(404).json({ status: false, message: "productId not found" });

        }

        const updatedProduct = await Product.findOneAndUpdate({ _id: new mongodb.ObjectId(req.params.productId) }, { $set: req.body }, { returnDocument: 'after' });

        return res.status(200).send({ status: true, data: updatedProduct });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ status: false, message: error.message });

    }
}



const deleteProduct = async (req, res) => {

    try {

        const getProduct = await Product.findOne({ _id: new mongodb.ObjectId(req.params.productId) });

        if (!getProduct) {
            return res.status(404).json({ status: false, message: error.message });

        }

        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'full',
        });

        const deletedProduct = await Product.findOneAndUpdate({ _id: new mongodb.ObjectId(req.params.productId) }, { $set: { isDeleted: true, deletedAt: date } }, { returnDocument: 'after' });

        return res.status(200).send({ status: true, data: deletedProduct });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ status: false, message: error.message });

    }
}

export { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct };