import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	user_id: { type: mongoose.Types.ObjectId, ref: "User" },
	cart: [{
		trip_id: { type: mongoose.Types.ObjectId, ref: "Trip" },
		departure_date: { type: Date },
		travelers: [{
			firstName: { type: String },
			lastName: { type: String }
		}]
	}]
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;