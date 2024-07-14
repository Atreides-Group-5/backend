import Booking from "../models/bookingModel.js";
import Trip from "../models/tripModel.js";
import Coupon from "../models/couponModel.js";
import Cart from "../models/cartModel.js";

const calculateDiscountAmount = (bookedTrips, type, discount) => {
  // console.log("BOOKED TRIPS:", bookedTrips);
  let discount_amount = 0;
  if (type === "fixed") {
    discount_amount = discount;
  } else if (type === "percent") {
    let totalPrice = 0;
    for (let trip of bookedTrips) {
      // use for-of because bookedTrips is array
      // console.log("TRIP:", trip);
      totalPrice += trip.trip.price * trip.travelers.length;
    }
    discount_amount = (totalPrice * discount) / 100;
  }
  return discount_amount;
};

// Create booking
const createBooking = async (req, res) => {
  const { booked_trips, coupon_id, cart_item_ids } = req.body;
  // console.log(booked_trips, coupon_id, cart_item_ids);

  let booked_trips_details = [];
  try {
    booked_trips_details = await Promise.all(
      booked_trips.map(async (booked_trip) => {
        const trip = await Trip.findById(booked_trip.trip_id);
        if (!trip) {
          // if coming from cart or cart-edit-item,
          // remove trip(s) with the corresponding id from cart item
          await Cart.findOneAndUpdate(
            { user_id: req.user.id },
            { $pull: { cart: { trip_id: booked_trip.trip_id } } }
          );
          throw new Error("Trip not found");
        }
        console.log("TRIP:", trip);
        const { images, ...rest } = trip.toObject();
        const image = images[0];
        return {
          trip: { ...rest, image },
          departure_date: booked_trip.departure_date,
          travelers: booked_trip.travelers,
        };
      })
    );
  } catch (error) {
    // console.log("Trip not found: ", error);
    return res.status(404).json({ error: "Trip no longer exists" });
  }

  let discount_amount = 0;
  let coupon = null;
  if (coupon_id) {
    coupon = await Coupon.findById(coupon_id);
    if (!coupon) {
      // console.log("Coupon not found");
      return res.status(404).json({ error: "Coupon not found" });
    }
    discount_amount = calculateDiscountAmount(
      booked_trips_details,
      coupon.type,
      coupon.discount
    );
  }

  const booking = new Booking({
    user_id: req.user.id,
    booked_trips: booked_trips_details,
    coupon: {
      code: coupon ? coupon.code : "N/A",
      discount_amount: discount_amount,
    },
  });

  // console.log(booking);

  try {
    const savedBooking = await booking.save();
    // DELETE CART ITEM FROM USER's CART
    for (let cart_item_id of cart_item_ids) {
      await Cart.findOneAndUpdate(
        { user_id: req.user.id },
        { $pull: { cart: { _id: cart_item_id } } }
      );
    }
    // console.log(savedBooking);
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: savedBooking._id,
    });
  } catch (err) {
    console.log("Error creating booking: ", err);
    res.status(500).json({ error: err.message });
  }
};

// Get user booking by status
const getBookingsByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const bookings = await Booking.find({
      user_id: req.user.id,
      booking_status: status,
    });
    res.json({ message: "Successfully retrieved bookings", bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve bookings" });
  }
};

// Make payment
const makePayment = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.booking_status === "completed") {
      return res.status(400).json({ error: "Booking already paid" });
    }

    if (booking.booking_status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    booking.booking_status = "completed";
    await booking.save();
    res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to make payment" });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.booking_status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    booking.booking_status = "cancelled";
    await booking.save();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

const getBookingById = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId).lean();

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user_id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this booking" });
    }

    let total_amount = 0;
    booking.booked_trips.forEach((trip) => {
      total_amount += trip.trip.price * trip.travelers.length;
    });

    const final_amount = total_amount - (booking.coupon?.discount_amount || 0);

    const bookingWithTotals = {
      ...booking,
      total_amount,
      final_amount,
    };

    res.json({ booking: bookingWithTotals });
  } catch (error) {
    console.error("Error in getBookingById:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve booking", details: error.message });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().lean();

    const bookingsWithTotals = bookings.map((booking) => {
      let total_amount = 0;
      booking.booked_trips.forEach((trip) => {
        total_amount += trip.trip.price * trip.travelers.length;
      });

      const final_amount =
        total_amount - (booking.coupon?.discount_amount || 0);

      return {
        ...booking,
        total_amount,
        final_amount,
      };
    });

    res.json({
      message: "Successfully retrieved all bookings",
      bookings: bookingsWithTotals,
    });
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
};

export {
  createBooking,
  getBookingsByStatus,
  makePayment,
  cancelBooking,
  getBookingById,
  getAllBookings,
};
