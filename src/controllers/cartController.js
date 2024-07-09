import Cart from '../models/cartModel.js';

// Add to cart
const addToCart = async (req, res) => {
    const { trip_id, departure_date, travelers } = req.body;
    // console.log(req.body);
    // console.log("USER", req.user);
    try {
        let cart = await Cart.findOneAndUpdate(
            { user_id: req.user.id },
            { $push: { cart: { trip_id, departure_date, travelers } } },
            { new: true }
        );
        if (!cart) {
            cart = new Cart({
                user_id: req.user.id,
                cart: [{
                    trip_id,
                    departure_date,
                    travelers
                }]
            });
        }
        await cart.save();
        res.json({ message: 'Successfully added to cart',  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
}


export { addToCart, getCart };