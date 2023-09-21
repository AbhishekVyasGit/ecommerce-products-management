import { Router } from "express";
import ValidationMiddleware from "../middleWares/validator.js"
import { userSchema, productSchema, cartSchema, orderSchema,updateUserSchema, updateProductSchema, updateCartSchema, updateOrderSchema } from "../models/models.js";
import userController from "../controllers/userController.js";
import authentication from "../middleWares/authentication.js";
import authorization from "../middleWares/authorization.js";
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { createCart, updateCart, getCart, deleteCart } from "../controllers/cartController.js";
import { createOrder,updateOrder  } from "../controllers/orderController.js";
import { newCart,newUpdateCart } from "../controllers/newCartControl.js";


const router = Router();

// user routes

router.post("/register", ValidationMiddleware(userSchema), userController.register);
router.post("/login", userController.login);
router.get("/user/:userId/profile", authentication, authorization, userController.getProfile);
router.patch("/user/:userId/profile",  ValidationMiddleware(updateUserSchema),authentication, authorization, userController.updateProfile);

// product routes

router.post("/products", ValidationMiddleware(productSchema), createProduct);
router.get("/products", getAllProducts);
router.get("/products/:productId", getProduct);
router.patch("/products/:productId",ValidationMiddleware(updateProductSchema), updateProduct);
router.delete("/products/:productId", deleteProduct);

// cart routes

router.post("/users/:userId/cart", ValidationMiddleware(cartSchema), authentication, authorization, createCart);
router.patch("/users/:userId/cart", ValidationMiddleware(updateCartSchema), authentication, authorization, updateCart);
router.get("/users/:userId/cart", authentication, authorization, getCart);
router.delete("/users/:userId/cart", authentication, authorization, deleteCart);


// order routes

router.post("/users/:userId/orders", ValidationMiddleware(orderSchema), authentication, authorization, createOrder);
router.patch("/users/:userId/orders",ValidationMiddleware(updateOrderSchema), authentication, authorization, updateOrder );




// if API is Invalid OR wrong URL 

router.all("/**", function (req, res) {
    res.status(404).send({ status: false, msg: "The api you request is not available" })
})


export default router;