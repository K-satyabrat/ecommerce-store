import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Find by product field,
   const existingItem = user.cartItems.find(
  (item) => item.product && item.product.toString() === productId
);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.product && item.product.toString() !== productId
      );
    }
    await user.save();
    return res.json(user.cartItems);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const {id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.product && item.product.toString() !== productId
        );
        await user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      return res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error in updateQuantity controller", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getCartProducts = async (req, res) => {
  try {
    const productIds = req.user.cartItems.map(item => item.product);
const products = await Product.find({ _id: { $in: productIds } }); /**req.user.cartItems = [
  ObjectId("64e123abc123abc123abc001"),
  ObjectId("64e123abc123abc123abc002")
];
 */

    // add quantity for each product
  const cartItems = products.map((product) => {
  const item = req.user.cartItems.find(
    (cartItem) => cartItem.product && cartItem.product.toString() === product._id.toString()
  );
  return { ...product.toJSON(), quantity: item ? item.quantity : 1 };
});

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
