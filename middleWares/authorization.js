import jwt from "jsonwebtoken";
const secretKey = "library";


const authorization = async (req, res, next) => {

    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {

            token = token.split(" ")[1];
        };

        let verifyToken = jwt.verify(token, secretKey);


        if (verifyToken.userId !== req.params.userId) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        next();


    } catch (error) {

        return res.status(500).json({ message: error.message });

    }

}

export default authorization;
