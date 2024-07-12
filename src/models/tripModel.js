import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
	name: { type: String, required: true },
	duration_days: { type: Number, required: true },
	destination_from: { type: String, required: true },
	destination_to: { type: String, required: true },
	rating: { type: Number, required: true },
	price: { type: Number, required: true },
	description: { type: String, required: true },
	sub_expenses: [{ 
		expense_name: { type: String, required: true },
		expense_amount: { type: Number, required: true },
	}],
	images: { type: [String], required: true }
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;