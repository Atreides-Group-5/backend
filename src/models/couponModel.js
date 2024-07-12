import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  type: { type: String, required: true },
  discount: { type: Number, required: true },
  minimumPurchaseAmount: { type: Number, default: 0 },
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
