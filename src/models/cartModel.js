import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
	cart: [{
		trip_id: { type: mongoose.Types.ObjectId, ref: "Trip", required: true },
		departure_date: { type: Date, required: true },
		travelers: [{
			firstName: { type: String, required: true },
			lastName: { type: String, required: true }
		}]
	}]
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
