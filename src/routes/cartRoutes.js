import express from "express";
import * as cartController from "../controllers/cartController.js";
import { authenticateMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', authenticateMiddleware, cartController.addToCart);
router.get('/', authenticateMiddleware, cartController.getCart);

// Get the cart item in the cart array by id
router.get('/:id', authenticateMiddleware, cartController.getCartItemById);

// Delete from cart the item in the cart array by id
router.delete('/:id', authenticateMiddleware, cartController.deleteFromCart);

// Update the cart item in the cart array by id
router.put('/:id', authenticateMiddleware, cartController.updateCartItem);

export default router;