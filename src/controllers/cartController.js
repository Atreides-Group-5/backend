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
        res.json({ message: 'Successfully added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
}

// Get user cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            cart = new Cart({
                user_id: req.user.id,
                cart: []
            });
            cart = await Cart.create(cart);
        }
        
        console.log(cart);
        res.json({ message: 'Successfully retrieved cart', cart: cart.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve cart' });
    }
}

// Delete from cart
const deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
        await Cart.findOneAndUpdate(
            { user_id: req.user.id },
            { $pull: { cart: { _id: id } } }
        );
        res.json({ message: 'Successfully deleted from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete from cart' });
    }
}

export { addToCart, getCart, deleteFromCart };