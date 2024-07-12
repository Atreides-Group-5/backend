import Booking from '../models/bookingModel.js';
import Trip from '../models/tripModel.js';
import Coupon from '../models/couponModel.js';
import Cart from '../models/cartModel.js';

const calculateDiscountAmount = (bookedTrips, type, discount) => {
    let discount_amount = 0;
    if (type === 'fixed') {
        discount_amount = discount;
    } else if (type === 'percent') {
        let totalPrice = 0;
        for(let trip in bookedTrips) {
            totalPrice += (trip.trip.price) * (trip.travelers.length);
        } 
        discount_amount = (totalPrice * discount) / 100;
    }
    return discount_amount;
};

// Create booking
const createBooking = async (req, res) => {
	const { booked_trips, coupon_id, cart_item_ids } = req.body;
    
    let booked_trips_details = [];
    try {
        booked_trips_details = await Promise.all(booked_trips.map(async (booked_trip) => {
            const trip = await Trip.findById(booked_trip.trip_id);
            if (!trip) {
                // if coming from cart or cart-edit-item, 
                // remove trip(s) with the corresponding id from cart item
                await Cart.findOneAndUpdate(
                    { user_id: req.user.id },
                    { $pull: { cart: { trip_id: booked_trip.trip_id } } }
                );
                throw new Error('Trip not found');  
            } 
            const { images, ...rest } = trip;
            const image = images[0];
            return {
                trip: { ...rest, image },
                travelers: booked_trip.travelers
            };
        }));
    } catch (error) {
        return res.status(404).json({ error: "Trip no longer exists" });
    }

    let discount_amount = 0;
    let coupon = null;
    if (coupon_id) {
        coupon = await Coupon.findById(coupon_id);
        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found" });
        }
        discount_amount = calculateDiscountAmount(booked_trips_details, coupon.type, coupon.discount);
    }

	const booking = new Booking({
		user_id: req.user.id,
		booked_trips: booked_trips_details,
		coupon: {
			code: coupon ? coupon.code : "N/A",
			discount_amount: discount_amount
		}
	});

    console.log(booking);

	try {
		const savedBooking = await booking.save();
        // DELETE CART ITEM FROM USER's CART
        for(let cart_item_id of cart_item_ids) {
            await Cart.findOneAndUpdate(
                { user_id: req.user.id },
                { $pull: { cart: { _id: cart_item_id } } }
            );
        }
        // console.log(savedBooking);
		res.status(201).json({message: 'Booking created successfully'});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Get user booking by status
const getBookingsByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const bookings = await Booking.find({ user_id: req.user.id, booking_status: status });
        res.json({ message: 'Successfully retrieved bookings', bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve bookings' });
    }
}
export { createBooking, getBookingsByStatus };