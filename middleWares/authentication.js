import jwt from "jsonwebtoken";
const secretKey = "library";

const authentication = (req, res, next) => {

    try {

        let token = req.headers.authorization;

        if (token) {

            token = token.split(" ")[1];

            // jwt library has verify function, that verify the token & also provides information which is inside the token

            let decodedUser = jwt.verify(token, secretKey);

            // console.log("decodedUser => ", decodedUser);

            req.userId = decodedUser.userId; // user.userId is provided by token

        }
        else {

            res.status(401).json({ message: "unauthorized user" });
        }

        return next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}


export default authentication;