import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    booked_trips: [{
        trip: {  		// จะเอาข้อมูล trip หมดไหม
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
            image: { type: String, required: true }
        },
        departure_date: { type: Date, required: true },
        travelers: [{
            firstName: { type: String, required: true },
			lastName: { type: String, required: true }
        }]
	}],
    booked_at: { type: Date, default: new Date().getTime() },
    booking_status: { type: String, default: "pending" },
    payment_method: {
        method: { type: String },
        card_no: { type: String }
    },
    coupon: {
        code: { type: String },
        discount_amount: { type: Number } // in $, not %
    }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;