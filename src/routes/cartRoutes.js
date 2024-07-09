import express from "express";
import * as cartController from "../controllers/cartController.js";
import { authenticateMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', authenticateMiddleware, cartController.addToCart);

export default router;