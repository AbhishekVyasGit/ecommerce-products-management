import Joi from "joi";

// user Schema validation

const userSchema = Joi.object(
    {
        fname: Joi.string().min(1).max(20).required(),
        lname: Joi.string().min(1).max(20).required(),
        email: Joi.string().email().lowercase().required(),
        profileImage: Joi.string().required(),
        phone: Joi.string().min(10).max(11).required(),
        password: Joi.string().min(7).required().strict(),
        address: {
            shipping: {
                street: Joi.string().min(3).required(),
                city: Joi.string().min(3).required(),
                pin: Joi.string().min(3).required()
            },
            billing: {
                street: Joi.string().min(3).required(),
                city: Joi.string().min(3).required(),
                pin: Joi.string().min(3).required()
            }
        },
        createdAt: Joi.date().required(),
        updatedAt: Joi.date().required()


    }
).options({ abortEarly: false });


// product Schema validation


const productSchema = Joi.object(

    {

        title: Joi.string().min(1).required(),
        description: Joi.string().required(),
        price: Joi.number().min(1).required(),
        currencyId: Joi.string().required(),
        currencyFormat: Joi.string().required().default("₹"),
        isFreeShipping: Joi.boolean().required().default(false),
        productImage: Joi.string().required(),
        style: Joi.string(),
        availableSizes: Joi.array().items(Joi.string()).min(1).required(),
        installments: Joi.number(),
        deletedAt: Joi.date(),
        isDeleted: Joi.boolean().default(false),
        createdAt: Joi.date().required(),
        updatedAt: Joi.date().required(),


    }

).options({ abortEarly: false });



//  cart Schema validation

const cartSchema = Joi.object(
    {
        cartId: Joi.string().hex().length(24),
        userId: Joi.string().hex().length(24).required(),
        items: Joi.array().items({
            productId: Joi.string().hex().length(24).required(),
            quantity: Joi.number().min(1).required(),

        }),
        totalPrice: Joi.number().required(),          //  {comment: "Holds total price of all the items in the cart"}
        totalItems: Joi.number().required(),         //   {comment: "Holds total number of items in the cart"}
        createdAt: Joi.date().required(),
        updatedAt: Joi.date().required(),

    }
).options({ abortEarly: false });



// order Schema validation

const orderSchema = Joi.object(
    {
        userId: Joi.string().hex().length(24).required(),
        items: Joi.array().items({
            productId: Joi.string().hex().length(24).required(),
            quantity: Joi.number().min(1).required(),

        }),
        totalPrice: Joi.number().required(),       //  { comment: "Holds total price of all the items in the cart" }
        totalItems: Joi.number().required(),           // { comment: "Holds total number of items in the cart" }
        totalQuantity: Joi.number().required(),       //  {  comment: "Holds total number of quantity in the cart" }
        cancellable: Joi.boolean().default(true),
        status: Joi.string().valid("pending", "completed", "canceled"),
        deletedAt: Joi.date(),
        isDeleted: Joi.boolean().default(false),
        createdAt: Joi.date().required(),
        updatedAt: Joi.date().required()

    }
).options({ abortEarly: false });



// update user Schema validation

const updateUserSchema = Joi.object(
    {
        fname: Joi.string().min(1).max(20),
        lname: Joi.string().min(1).max(20),
        email: Joi.string().email().lowercase(),
        profileImage: Joi.string(),
        phone: Joi.string().min(10).max(11),
        password: Joi.string().min(7).strict(),
        address: {
            shipping: {
                street: Joi.string().min(3),
                city: Joi.string().min(3),
                pin: Joi.string().min(3)
            },
            billing: {
                street: Joi.string().min(3),
                city: Joi.string().min(3),
                pin: Joi.string().min(3)
            }
        },
        createdAt: Joi.date(),
        updatedAt: Joi.date()


    }
).options({ abortEarly: false });


// update product Schema validation


const updateProductSchema = Joi.object(

    {

        title: Joi.string().min(1),
        description: Joi.string(),
        price: Joi.number().min(1),
        currencyId: Joi.string(),
        currencyFormat: Joi.string().default("₹"),
        isFreeShipping: Joi.boolean().default(false),
        productImage: Joi.string(),
        style: Joi.string(),
        availableSizes: Joi.array().items(Joi.string()).min(1),
        installments: Joi.number(),
        deletedAt: Joi.date(),
        isDeleted: Joi.boolean().default(false),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),


    }

).options({ abortEarly: false });



//  update cart Schema validation

const updateCartSchema = Joi.object(
    {
        removeProduct: Joi.number().valid(0, 1),
        cartId: Joi.string().hex().length(24),
        userId: Joi.string().hex().length(24),
        items: Joi.array(),
        productId: Joi.string().hex().length(24),
        quantity: Joi.number().min(1),
        totalPrice: Joi.number(),          //  {comment: "Holds total price of all the items in the cart"}
        totalItems: Joi.number(),         //   {comment: "Holds total number of items in the cart"}
        createdAt: Joi.date(),
        updatedAt: Joi.date(),

    }
).options({ abortEarly: false });



//  update order Schema validation

const updateOrderSchema = Joi.object(
    {
        orderId: Joi.string().hex().length(24),
        userId: Joi.string().hex().length(24),
        items: Joi.array(),
        productId: Joi.string().hex().length(24),
        totalPrice: Joi.number(),       //  { comment: "Holds total price of all the items in the cart" }
        totalItems: Joi.number(),           // { comment: "Holds total number of items in the cart" }
        totalQuantity: Joi.number(),       //  {  comment: "Holds total number of quantity in the cart" }
        cancellable: Joi.boolean(),
        status: Joi.string().valid("pending", "completed", "canceled"),
        deletedAt: Joi.date(),
        isDeleted: Joi.boolean().default(false),
        createdAt: Joi.date(),
        updatedAt: Joi.date()

    }
).options({ abortEarly: false });



export { userSchema, productSchema, cartSchema, orderSchema, updateUserSchema, updateProductSchema, updateCartSchema, updateOrderSchema };
