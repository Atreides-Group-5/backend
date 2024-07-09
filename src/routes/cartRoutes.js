import express from "express";
import * as cartController from "../controllers/cartController.js";
import { authenticateMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', authenticateMiddleware, cartController.addToCart);
router.get('/', authenticateMiddleware, cartController.getCart);
router.delete('/:id', authenticateMiddleware, cartController.deleteFromCart);

export default router;