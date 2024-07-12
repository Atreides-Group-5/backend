import express from "express";
import * as couponController from "../controllers/couponController.js";
import { authenticateAdminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", couponController.getAllCoupons);
router.get("/code/:code", couponController.getCouponByCode);
router.get("/:id", couponController.getCouponById);
router.put("/:id", authenticateAdminMiddleware, couponController.updateCoupon);
router.post("/", authenticateAdminMiddleware, couponController.createCoupon);
router.delete("/:id", authenticateAdminMiddleware, couponController.deleteCoupon);

export default router;
