import express from "express";
import * as couponController from "../controllers/couponController.js";

const router = express.Router();

router.get('/', couponController.getAllCoupons);
router.patch('/:id', couponController.updateCoupon);
router.post('/', couponController.createCoupon);
router.delete('/:id', couponController.deleteCoupon);

export default router;