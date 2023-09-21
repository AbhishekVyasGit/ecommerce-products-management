
const ValidationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body,{ abortEarly: false });

        if (error) {
            // Handle validation error
            console.log(error.message);

            res.status(400).json({ errors: error.details });
        } else {

            // res.send(value);
            // Data is valid, proceed to the next middleware
            next();
        }
    };
};




export default ValidationMiddleware;

