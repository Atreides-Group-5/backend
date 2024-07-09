import Coupon from '../models/couponModel.js';

// Get all coupons
const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json({ message: 'Get All Coupons', coupons: coupons });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Get coupon by id
const getCouponById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const coupon = await Coupon.findById({ _id: id });
        res.status(200).json({ message: 'Get Coupon', coupon: coupon });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Create coupon
const createCoupon = async (req, res, next) => {
    try {
        const {
            name,
            type,
            discount
        } = req.body;
        const couponData = {
            name,
            type,
            discount
        };
        const coupon = await Coupon.create(couponData);
        res.status(201).json({ message: 'Created Coupon', coupon: coupon });
    } catch (error) {
        next(error);
    }
}

// Update coupon by id
const updateCoupon = async (req, res) => {
    // console.log(req.body);
    const { id } = req.params;
    const { name, type, discount } = req.body;
    const couponData = {
        name,
        type,
        discount
    };
    try {
        if (!name || !type || !discount) {
            throw new Error("Bad Request");
        }
        const coupon = await Coupon.findByIdAndUpdate({ _id: id }, couponData, { new: true });
        res.status(200).json({ message: 'Updated Coupon', coupon: coupon });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Delete coupon by id
const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await Coupon.findByIdAndDelete({ _id: id });
        const message = coupon ? 'Deleted Coupon' : 'Coupon not found';
        res.status(200).json({ message: message });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export { getAllCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon };