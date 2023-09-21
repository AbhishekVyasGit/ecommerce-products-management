import mongodb from "mongodb"
import db from "../configs/db.js";
const User = db.collection('user');
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const secretKey = "library"

const register = async (req, res) => {

    try {


        const oldUser = await User.findOne({ email: req.body.email });

        if (oldUser) {
            return res.status(400).json({ message: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        // create user

        let date = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'full',
        });

        req.body.createdAt = date;
        req.body.updatedAt = date;

        req.body.password = hashedPassword;

        const user = await User.insertOne(req.body);

        // create token

     //   const token = jwt.sign({ userId: user._id, email: req.body.email }, secretKey);

        return res.status(201).json({ message: "user register successfully" });


    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: err.message });
    }


}



const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        // validate user input 

        if (!(email && password)) {
            return res.status(400).json({ message: "Email and password is required" });
        };

        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.status(404).json({ message: "user is not exist, please register first" });
        };

        const matchedPassword = await bcrypt.compare(password, oldUser.password);
        if (!matchedPassword) {
            return res.status(400).json({ message: "password is not matched" });
        }

       // create token

        const token = jwt.sign({ userId: oldUser._id, email }, secretKey);

        // console.log("token => ", token);

        return res.status(200).json({ user: oldUser, token: token });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: false, message: err.message });

    }
}



const getProfile = async (req, res) => {

    try {

        const userId = req.params.userId;

        const getUser = await User.findOne({ _id: new mongodb.ObjectId(userId) });

        return res.status(200).json({ status: true, data: getUser });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }


}




const updateProfile = async (req, res) => {

    try {

        const userId = req.params.userId;

        const updateUser = await User.findOneAndUpdate({ _id: new mongodb.ObjectId(userId) }, { $set: req.body }, { returnDocument: 'after' });

        return res.status(200).json({ status: true, data: updateUser });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }


}

export default { register, login, getProfile, updateProfile };
