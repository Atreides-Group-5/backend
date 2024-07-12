import Coupon from "../models/couponModel.js";

// Get all coupons
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ message: "Get All Coupons", coupons: coupons });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get coupon by id
const getCouponById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById({ _id: id });
    res.status(200).json({ message: "Get Coupon", coupon: coupon });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create coupon
const createCoupon = async (req, res, next) => {
  try {
    const { name, code, type, discount, minimumPurchaseAmount } = req.body;

    const couponData = {
      name,
      code,
      type,
      discount,
      minimumPurchaseAmount: minimumPurchaseAmount || 0,
    };

    const coupon = await Coupon.create(couponData);
    res.status(201).json({ message: "Created Coupon", coupon: coupon });
  } catch (error) {
    next(error);
  }
};
// Update coupon by id
const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { name, code, type, discount, minimumPurchaseAmount } = req.body;

  const couponData = {
    name,
    code,
    type,
    discount,
    minimumPurchaseAmount: minimumPurchaseAmount || 0, // ถ้าไม่ได้ส่งมาให้ default เป็น 0
  };

  try {
    if (!name || !code || !type || !discount) {
      throw new Error("Bad Request");
    }

    const coupon = await Coupon.findByIdAndUpdate({ _id: id }, couponData, {
      new: true,
    });
    res.status(200).json({ message: "Updated Coupon", coupon: coupon });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// Delete coupon by id
const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndDelete({ _id: id });
    const message = coupon ? "Deleted Coupon" : "Coupon not found";
    res.status(200).json({ message: message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getCouponByCode = async (req, res, next) => {
  const { code } = req.params;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Get Coupon", coupon: coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponByCode,
};
